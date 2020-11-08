import SuperAgent from 'superagent'

import store from '../../stores'
import { updateUser } from '../../store_actions/user'

import config from '../../../config/public'
import { getActiveTeamId } from '../../utils/user-teams'

import { herokuFix } from './middlewares/heroku-fix'
import { useReferencedFormat } from './middlewares/x-rechat-format'

import { IOptions, IMiddleware } from './types'

export default class Fetch {
  private _middlewares: IMiddleware = {}

  private options: IOptions

  private _isProductionEnv: boolean

  private _startTime: null | number

  private _isServerSide: boolean

  private _proxyUrl: string

  private _isLoggedIn: boolean

  constructor(options?: IOptions) {
    const isServerSide = typeof window === 'undefined'
    const isProductionEnv = process.env.NODE_ENV === 'production'

    this.options = {
      proxy: true,
      progress: null,
      useReferencedFormat: true,
      ...options
    }

    this._middlewares = this.registerMiddlewares(this.options)
    this._isServerSide = isServerSide
    this._proxyUrl = `${config.proxy.url}/api/proxifier`
    this._isProductionEnv = isProductionEnv
    this._startTime = Date.now()
  }

  _create(method: string, endpoint: string): SuperAgent.SuperAgentRequest {
    const { user, brand } = store.getState() as any

    let brandId

    if (user) {
      brandId = getActiveTeamId(user)
    }

    if (!brandId && brand) {
      brandId = brand.id
    }

    const useProxy = this.options.proxy || this._isServerSide

    this._isLoggedIn = user && user.access_token !== undefined

    const agent: SuperAgent.SuperAgentRequest = useProxy
      ? SuperAgent.post(this._proxyUrl)
          .set('X-Method', method)
          .set('X-Endpoint', endpoint)
      : SuperAgent[method](`${config.api_url}${endpoint}`)

    if (this.options.useReferencedFormat && !useProxy) {
      agent.set('X-RECHAT-FORMAT', 'references')
    }

    // auto append access-token
    if (this._isLoggedIn) {
      agent.set('Authorization', `Bearer ${user.access_token}`)
    }

    // We currently have problems in using any environment other than development
    // when we want the server to work in development mode (run webpack in
    // dev mode and in memory). So we use e2e as a workaround.
    if (process.env.NODE_ENV === 'ci' || process.env.E2E) {
      // Without this header, API is partly broken because background jobs
      // are not handled in the request normally. We need to either run
      // worker process or send this header. Running worker process didn't work
      // out for some unknown reason.
      // more info:
      // https://rechathq.slack.com/archives/DJ1EYKXCM/p1561551805103700
      agent.set('x-handle-jobs', 'yes')
    }

    if (brandId) {
      agent.set('X-RECHAT-BRAND', brandId)
    }

    agent.on(
      'response',
      (
        response: SuperAgent.Response & { req: SuperAgent.SuperAgentRequest }
      ) => {
        this.runMiddlewares(response)

        this.logResponse(response)
      }
    )

    agent.on(
      'error',
      (error: {
        response: (SuperAgent.Response & {
          statusCode: number
        }) & { req: SuperAgent.SuperAgentRequest }
      }) => {
        const errorCode = error.response && ~~error.response.statusCode

        this.logResponse(error.response)

        // create error log
        this.createErrorLog(errorCode, error)

        if (errorCode === 401) {
          this.handle401Error(error, agent, user)
        }
      }
    )

    if (typeof this.options.progress === 'function') {
      agent.on('progress', this.options.progress)
    }

    return agent
  }

  handle401Error(error, agent: SuperAgent.SuperAgentRequest, user: IUser) {
    // server send to client 401 error for invalid answer!
    // Emil said "we can not change it in server",
    // so we forced to handle it in here with this dirty way.
    // https://gitlab.com/rechat/web/issues/695
    //
    const isUpgradeToAgentRequest =
      error.response?.body?.message === 'Invalid answer to secret question'

    if (isUpgradeToAgentRequest || this._isServerSide || !this._isLoggedIn) {
      return
    }

    this.refreshToken(agent, user)
  }

  /**
   * tries to refresh the token and retry the request when token is expired
   */
  async refreshToken(
    agent: SuperAgent.SuperAgentRequest & {
      header?: any
      _retries?: number
      _retry?: () => void
    },
    user: IUser
  ) {
    if (Number(agent._retries) > 0) {
      agent._retries = 0

      return
    }

    agent._retries = 1

    try {
      const {
        body: { access_token, refresh_token }
      } = await SuperAgent.post(
        `${this._proxyUrl}/api/user/refresh-token`
      ).send({
        access_token: user.access_token,
        refresh_token: user.refresh_token
      })

      store.dispatch(
        updateUser({
          access_token,
          refresh_token
        })
      )

      // set new token
      agent.header!.Authorization = `Bearer ${access_token}`

      // retry to previous request with new token
      agent._retry!()
    } catch (e) {
      console.log('[ Fetch ] Can not refresh token')
    }
  }

  get(endpoint: string) {
    return this._create('get', endpoint)
  }

  post(endpoint: string) {
    return this._create('post', endpoint)
  }

  put(endpoint: string) {
    return this._create('put', endpoint)
  }

  patch(endpoint: string) {
    return this._create('patch', endpoint)
  }

  delete(endpoint: string) {
    return this._create('delete', endpoint)
  }

  upload(endpoint: string, method = 'post') {
    return this._create(method, endpoint)
  }

  registerMiddlewares(options: IOptions): IMiddleware {
    const list: IMiddleware = {}

    // it's required
    list['heroku-fix'] = herokuFix

    if (options.useReferencedFormat) {
      list['x-rechat-format'] = useReferencedFormat
    }

    return list
  }

  runMiddlewares(
    response: SuperAgent.Response & { req: SuperAgent.SuperAgentRequest }
  ) {
    Object.values(this._middlewares).forEach(fn => fn(response))
  }

  createErrorLog(
    code: number,
    error: { response?: SuperAgent.Response; message?: string } = {}
  ) {
    if (!this._isProductionEnv) {
      return
    }

    const now = Date.now()
    const diff = now - (this._startTime || now)

    console.error(
      `Error ${code}: `,
      error.response ? error.response.text : error.message,
      `(Response Time: ${diff / 1000}s)`
    )
  }

  logResponse(
    response: SuperAgent.Response & { req: SuperAgent.SuperAgentRequest }
  ) {
    if (this._isProductionEnv && response) {
      const requestId = response.header['x-request-id']
      const status = response.status
      const request = response.req
      const elapsed = Date.now() - (this._startTime || Date.now())

      console.log(
        `${status} <${requestId}> (${elapsed}ms) ${request.method} ${request.url}`
      )
    }
  }
}

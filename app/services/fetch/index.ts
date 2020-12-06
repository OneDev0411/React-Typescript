import SuperAgent from 'superagent'

import { IAppState } from 'reducers'

import store from '../../stores'

import config from '../../../config/public'
import { getActiveTeamId } from '../../utils/user-teams'

import { herokuFix } from './middlewares/heroku-fix'
import { useReferencedFormat } from './middlewares/x-rechat-format'

import { IOptions, IMiddleware } from './types'

export default class Fetch {
  private middlewares: IMiddleware = {}

  private options: IOptions

  private isProductionEnv: boolean

  private startTime: null | number

  private isLoggedIn: boolean

  constructor(options?: IOptions) {
    const isProductionEnv = process.env.NODE_ENV === 'production'

    this.options = {
      proxy: true,
      progress: null,
      useReferencedFormat: true,
      ...options
    }

    this.middlewares = this.registerMiddlewares(this.options)
    this.isProductionEnv = isProductionEnv
    this.startTime = Date.now()
  }

  private create(
    method: string,
    endpoint: string,
    isUploadMethod: boolean = false
  ): SuperAgent.SuperAgentRequest {
    const { user, brand } = store.getState() as IAppState

    let brandId

    if (user) {
      brandId = getActiveTeamId(user)
    }

    if (!brandId && brand) {
      brandId = brand.id
    }

    const useProxy = this.options.proxy && !isUploadMethod

    this.isLoggedIn = user && user.access_token !== undefined

    let agent: SuperAgent.SuperAgentRequest

    if (useProxy) {
      agent = endpoint.startsWith('/api/')
        ? SuperAgent[method](endpoint)
        : SuperAgent.post('/api/proxifier')
            .set('X-Method', method)
            .set('X-Endpoint', endpoint)
    } else {
      agent = SuperAgent[method](`${config.api_url}${endpoint}`)
    }

    if (this.options.useReferencedFormat && !useProxy) {
      agent.set('X-RECHAT-FORMAT', 'references')
    }

    // auto append access-token
    if (this.isLoggedIn) {
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
      }
    )

    if (typeof this.options.progress === 'function') {
      agent.on('progress', this.options.progress!)
    }

    return agent
  }

  get(endpoint: string) {
    return this.create('get', endpoint)
  }

  post(endpoint: string) {
    return this.create('post', endpoint)
  }

  put(endpoint: string) {
    return this.create('put', endpoint)
  }

  patch(endpoint: string) {
    return this.create('patch', endpoint)
  }

  delete(endpoint: string) {
    return this.create('delete', endpoint)
  }

  upload(endpoint: string, method = 'post') {
    return this.create(method, endpoint, true)
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
    Object.values(this.middlewares).forEach(fn => fn(response))
  }

  createErrorLog(
    code: number,
    error: { response?: SuperAgent.Response; message?: string } = {}
  ) {
    if (!this.isProductionEnv) {
      return
    }

    const now = Date.now()
    const diff = now - (this.startTime || now)

    console.error(
      `Error ${code}: `,
      error.response ? error.response.text : error.message,
      `(Response Time: ${diff / 1000}s)`
    )
  }

  logResponse(
    response: SuperAgent.Response & { req: SuperAgent.SuperAgentRequest }
  ) {
    if (this.isProductionEnv && response) {
      const requestId = response.header['x-request-id']
      const status = response.status
      const request = response.req
      const elapsed = Date.now() - (this.startTime || Date.now())

      console.log(
        `${status} <${requestId}> (${elapsed}ms) ${request.method} ${request.url}`
      )
    }
  }
}

import SuperAgent from 'superagent'

import store from '../../stores'
import config from '../../../config/public'
import { getActiveTeamId } from '../../utils/user-teams'

import herokuFix from './middlewares/heroku-fix'

export default class Fetch {
  constructor(options) {
    const isServerSide = typeof window === 'undefined'
    const isProductionEnv = process.env.NODE_ENV === 'production'

    this.options = Object.assign(
      {
        proxy: false,
        progress: null
      },
      options
    )

    this._middlewares = {}
    this._isServerSide = isServerSide
    this._appUrl = isServerSide ? config.app.url : ''
    this._proxyUrl = `${this._appUrl}/api/proxifier`
    this._isProductionEnv = isProductionEnv
    this._startTime = null
  }

  _create(method, endpoint) {
    const { user } = store.getState()
    const brandId = user ? getActiveTeamId(user) : null
    const useProxy = this.options.proxy || this._isServerSide

    this._isLoggedIn = user && user.access_token !== undefined

    if (this._isProductionEnv) {
      console.log(`${method.toUpperCase()} ${endpoint}`)
    }

    this._startTime = Date.now()

    let agent

    if (useProxy) {
      agent = SuperAgent.post(this._proxyUrl)
        .set('X-Method', method)
        .set('X-Endpoint', endpoint)
    } else {
      agent = SuperAgent[method](`${config.api_url}${endpoint}`)
    }

    // auto append access-token
    if (this._isLoggedIn) {
      agent.set('Authorization', `Bearer ${user.access_token}`)
    }

    if (brandId) {
      agent.set('X-RECHAT-BRAND', brandId)
    }

    // register events
    agent.on('response', response => {
      herokuFix(response)

      this.onResponse(response)
    })

    agent.on('error', error => {
      console.log(error.response)
      console.log('[ Request Error ]', error)

      const errorCode = error.response && ~~error.response.statusCode

      // create error log
      this.createErrorLog(errorCode, error)

      if (errorCode === 401) {
        this.handle401Error(error)
      }
    })

    if (typeof this.options.progress === 'function') {
      agent.on('progress', this.options.progress)
    }

    return agent
  }

  handle401Error(error) {
    // server send to client 401 error for invalid answer!
    // Emil said "we can not change it in server",
    // so we forced to handle it in here with this dirty way.
    // https://gitlab.com/rechat/web/issues/695
    //
    const { body } = error.response
    const errorMessage = body && body.message
    const isUpgradeToAgentRequest =
      errorMessage === 'Invalid answer to secret question'

    // handle session expiration
    if (!this._isServerSide && this._isLoggedIn && !isUpgradeToAgentRequest) {
      window.location.href = '/signout'
    }
  }

  get(endpoint) {
    return this._create('get', endpoint)
  }

  post(endpoint) {
    return this._create('post', endpoint)
  }

  put(endpoint) {
    return this._create('put', endpoint)
  }

  patch(endpoint) {
    return this._create('patch', endpoint)
  }

  delete(endpoint) {
    return this._create('delete', endpoint)
  }

  upload(endpoint, method = 'post') {
    return this._create(method, endpoint)
  }

  onResponse(response) {
    return response
  }

  createErrorLog(code, error = {}) {
    if (!this._isProductionEnv) {
      return
    }

    const now = Date.now()
    const diff = now - this._startTime

    console.error(
      `Error ${code}: `,
      error.response ? error.response.text : error.message,
      `(Response Time: ${diff / 1000}s)`
    )
  }

  middleware(name, options) {
    this._middlewares[name] = options

    return this
  }
}

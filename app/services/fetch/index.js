import _ from 'underscore'
import SuperAgent from 'superagent'
import store from '../../stores'
import config from '../../../config/public'

export default class Fetch {
  constructor() {
    const isServerSide = typeof window === 'undefined'
    const isTestEnv = process.env.NODE_ENV === 'test'
    const isProductionEnv = process.env.NODE_ENV === 'production'

    this._middlewares = {}
    this._autoLogin = true
    this._isServerSide = isServerSide
    this._baseUrl = isServerSide || isTestEnv ? config.app.url : ''
    this._proxyUrl = `${this._baseUrl}/api/proxifier`
    this._isProductionEnv = isProductionEnv
    this._startTime = null
  }

  _create(method, endpoint) {
    const state = store.getState()
    const { user, brand } = state.data

    this._isLoggedIn = user && user.access_token !== undefined

    if (this._isProductionEnv) {
      console.log(`${method.toUpperCase()} ${endpoint}`)
    }

    this._startTime = Date.now()

    const agent = SuperAgent.post(
      `${this._proxyUrl}/${this.getEndpointKey(endpoint)}`
    )
      .set('X-Method', method)
      .set('X-Endpoint', endpoint)
    // .retry(2)

    // auto append access-token
    if (this._autoLogin && this._isLoggedIn) {
      agent.set('Authorization', `Bearer ${user.access_token}`)
    }

    if (brand) {
      agent.set('X-RECHAT-BRAND', brand.id)
    }

    // register events
    agent.on('response', response => this.onResponse(response))

    agent.on('error', error => {
      const errorCode = error.response && ~~error.response.statusCode

      // create error log
      this.createErrorLog(errorCode, error)

      if (errorCode === 401) {
        this.handle401Error(error)
      }
    })

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

  getEndpointKey(url) {
    return url
      .split(/[?#]/)[0] // remove query string
      .replace('/', '') // change first slash to null
      .replace(/(?!^)\//g, '-') // change the rest slashes to dash
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
    this._proxyUrl += '/upload'

    return this._create(method, endpoint)
  }

  onResponse(response) {
    if (~~response.status < 200 || ~~response.status > 207) {
      return response
    }
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

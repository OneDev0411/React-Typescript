import _ from 'underscore'
import SuperAgent from 'superagent'
import nock from 'nock'
import store from '../../stores'
import config from '../../../config/public'

export default class Fetch {
  constructor() {
    const isServerSide = typeof window === 'undefined'
    const isTestEnv = process.env.NODE_ENV === 'test'

    this._middlewares = {}
    this._autoLogin = true
    this._isServerSide = isServerSide
    this._baseUrl = isServerSide || isTestEnv ? config.app.url : ''
    this._proxyUrl = `${this._baseUrl}/api/proxifier`
  }

  _create(method, endpoint) {
    const state = store.getState()
    const { user, brand } = state.data

    this._isLoggedIn = user && user.access_token !== undefined

    const agent = SuperAgent.post(`${this._proxyUrl}/${this.getEndpointKey(endpoint)}`)
      .set('X-Method', method)
      .set('X-Endpoint', endpoint)
      .retry(2)

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

      // handle session expiration
      if (!this._isServerSide && this._isLoggedIn && errorCode === 401) {
        window.location.href = '/signout'
      }
    })

    return agent
  }

  getEndpointKey(url) {
    return url
      .split(/[?#]/)[0] // remove query string
      .replace('/', '') // change first slash to null
      .replace(/(?!^)\//g, '-') // change the rest slashes to dash
  }

  mock({
    endpoint, method, statusCode, response
  }) {
    const endpointKey = this.getEndpointKey(endpoint)

    return nock(`${config.app.url}/api/proxifier`)
      [method || 'post'](`/${endpointKey}`)
      .reply(statusCode || 200, response)
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

    _.each(this._middlewares, (options, name) => {
      try {
        const handler = require(`./middlewares/${name}`).default

        response.body = handler(response.body, options)
      } catch (e) {
        console.warn(e)
      }
    })
  }

  middleware(name, options) {
    this._middlewares[name] = options

    return this
  }
}

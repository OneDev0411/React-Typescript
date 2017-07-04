import _ from 'underscore'
import store from '../../stores'
import SuperAgent from 'superagent'
import config from '../../../config/public'

export default class Fetch {
  constructor(options = {}) {
    const isServerSide = typeof window === 'undefined'

    this._middlewares = {}
    this._autoLogin = true
    this._baseUrl = isServerSide ? config.app.url : ''
  }

  _create(method, endpoint) {
    const state = store.getState()
    const { user, brand } = state.data

    const agent = SuperAgent.post(`${this._baseUrl}/api/proxifier`)
      .set('X-Method', method)
      .set('X-Endpoint', endpoint)

    // auto append access-token
    if (this._autoLogin && user && user.access_token) {
      agent.set('Authorization', `Bearer ${user.access_token}`)
    }

    if (brand) {
      agent.set('X-RECHAT-BRAND', brand.id)
    }

    // register events
    agent.on('response', response => this.onResponse(response))

    return agent
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

  onResponse(response) {
    if (~~response.status < 200 || ~~response.status > 207) {
      return response
    }

    _.each(this._middlewares, (options, name) => {
      try {
        const handler = require('./middlewares/' + name).default
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

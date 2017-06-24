import _ from 'underscore'
import store from '../../stores'
import SuperAgent from 'superagent'

export default class Fetch {
  constructor() {
    this._middlewares = {}
    this._autoLogin = true
  }

  _create(method, endpoint) {
    const state = store.getState()
    const { user } = state.data

    const agent = SuperAgent.post('/api/proxifier')
      .set('X-Method', method)
      .set('X-Endpoint', endpoint)

    // auto append access-token
    if (this._autoLogin && user && user.access_token) {
      agent.set({ Authorization: `Bearer ${user.access_token}` })
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

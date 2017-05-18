import SuperAgent from 'superagent'
import _ from 'underscore'
import store from '../../stores'
import config from '../../../config/public'

export default class Fetch {
  constructor() {
    this._middlewares = {}
    this._autoLogin = true
    this._useProxy = false
  }

  _create(method, endpoint) {
    const state = store.getState()
    const { user } = state.data

    // create superagent instance
    let agent

    if (this._useProxy) {
      agent = SuperAgent
        .post(`${config.app.url}/api/proxifier`)
        .set('X-Method', method)
        .set('X-Endpoint', endpoint)
    } else {
      agent = SuperAgent[method](endpoint)
    }

    // auto append access-token
    if (this._autoLogin && user && user.access_token)
      agent.set({ Authorization: `Bearer ${user.access_token}` })

    agent.on('error', this.onError)
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
    this._useProxy = true
    return this._create('put', endpoint)
  }

  patch(endpoint) {
    this._useProxy = true
    return this._create('patch', endpoint)
  }

  delete(endpoint) {
    this._useProxy = true
    return this._create('delete', endpoint)
  }

  onError(err) {
    throw err
  }

  onResponse(response) {
    if (~~response.status < 200 || ~~response.status > 207) {
      return response
    }

    _.each(this._middlewares, (options, name) => {
      try {
        const handler = require('./middlewares/' + name).default
        response.body = handler(response.body)
      } catch(e) {
        console.warn(e)
      }
    })
  }

  middleware(name, options) {
    this._middlewares[name] = options
    return this
  }
}

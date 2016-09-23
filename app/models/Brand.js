// models/Brand.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import config from '../../config/public'
export default {
  getByHostname: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    let endpoint = api_host + '/api/brands/search?hostname=' + params.hostname
    if (params.user)
      endpoint += '&access_token=' + params.user.access_token

    fetch(endpoint)
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  }
}
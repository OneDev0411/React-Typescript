// models/Listing.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'

import config from '../../config/public'

export default {
  search: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    const endpoint = api_host + '/api/listings/search?mls_number=' + params.mls_number + '&access_token=' + params.access_token

    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          message: 'There was an error with this request.'
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then((response) => {
      return callback(false, response)
    })
  }
}
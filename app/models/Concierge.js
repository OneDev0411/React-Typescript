import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import config from '../../config/public'

export default {
  getDeals: (params, callback) => {
    let api_host = params.api_host

    if (!api_host)
      api_host = config.app.url

    const endpoint = `${api_host}/api/brands/deals?access_token=${
      params.user}&brand_id=${params.brand_id}`

    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  getEnvelopes: (params, callback) => {
    let api_host = params.api_host

    if (!api_host)
      api_host = config.app.url

    const endpoint = `${api_host}/api/deals/envelopes?access_token=${
      params.user}&deal_id=${params.deal_id}`

    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  getSubmissions: (params, callback) => {
    let api_host = params.api_host

    if (!api_host)
      api_host = config.app.url

    const endpoint = `${api_host}/api/deals/submissions?access_token=${
      params.user}&deal_id=${params.deal_id}`

    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  }
}

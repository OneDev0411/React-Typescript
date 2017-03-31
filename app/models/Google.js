// models/Google.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
export default {
  geocodeAddress: (params, callback) => {
    const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${params.address}`
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
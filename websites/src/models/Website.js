// modesl/website
import ES6 from 'es6-promise'
ES6.polyfill()
import 'isomorphic-fetch'
export default {
  get(params, callback) {
    const endpoint = 'https://boer.d.rechat.com/websites'
    fetch(endpoint, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + params.access_token
      }
    })
    .then(response => {
      if (response.status >= 400) {
        return callback(response, null)
      }
      return response.json()
    })
    .then(response => {
      return callback(null, response)
    })
  },
  save(params, callback) {
    const endpoint = 'https://boer.d.rechat.com/websites'
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + params.access_token
      },
      body: JSON.stringify(params.website)
    })
    .then(response => {
      if (response.status >= 400) {
        return callback(response, null)
      }
      return response.json()
    })
    .then(response => {
      return callback(null, response)
    })
  }
}
// const schema = {
//   type: 'object',
//   properties: {
//     template: {
//       type: 'string',
//       required: true
//     },

//     user: {
//       type: 'string',
//       uuid: true,
//       required: true
//     },

//     brand: {
//       type: 'string',
//       uuid: true,
//       required: true
//     },

//     attributes: {
//       type: 'object',
//       required: true
//     }
//   }
// }
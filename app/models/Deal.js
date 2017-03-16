import agent from 'superagent'
import config from '../../config/public'

export default {
  getDeals: async function(params, callback) {
    const api_host = config.api_url

    const endpoint = api_host + '/deals'

    try {
      const response = await agent
        .get(endpoint)
        .set({ 'Authorization': `Bearer ${params.user}`})

      return callback(false, response)
    }
    catch(e) {
      const error = {
        status: 'error',
        response: e.response
      }
      return callback(error, false)
    }
  },
  getSubmissions: async function(params, callback) {
    const endpoint = `${config.api_url}/deals/${params.id}/submissions`

    try {
      const response = await agent
        .get(endpoint)
        .set({ 'Authorization': `Bearer ${params.user}`})

      return callback(false, response)
    }
    catch(e) {
      const error = {
        status: 'error',
        response: e.response
      }
      return callback(error, false)
    }
  },
  getEnvelopes: async function(params, callback) {
    const endpoint = `${config.api_url}/deals/${params.id}/envelopes`

    try {
      const response = await agent
        .get(endpoint)
        .set({ 'Authorization': `Bearer ${params.user}`})

      return callback(false, response)
    }
    catch(e) {
      const error = {
        status: 'error',
        response: e.response
      }
      return callback(error, false)
    }
  },
  uploadFile: async function(params, callback) {
    const endpoint = `${config.api_url}/deals/${params.id}/files`

    try {
      const response = await agent
        .post(endpoint)
        .set({ 'Authorization': `Bearer ${params.user.access_token}`})
        .attach(params.file.name, params.file)

      return callback(false, response)
    }
    catch(e) {
      const error = {
        status: 'error',
        response: e.response
      }
      return callback(error, false)
    }
  },
  resendEnvelopeDocs: async function(id, access_token) {
    try {
      const response = await agent
        .post(`${config.api_url}/envelopes/${id}/resend`)
        .set({ 'Authorization': `Bearer ${access_token}`})

      return response.body
    }
    catch(e) {
      throw e
    }
  }
}

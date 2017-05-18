import agent from 'superagent'
import _ from 'underscore'
import Fetch from '../services/fetch'
import config from '../../config/public'

const Deal = {}

// set api host
const api_host = config.api_url

Deal.getDeals = async function (params) {
  const { access_token } = params
  const endpoint = `${api_host}/deals`

  try {
    const response = await agent
      .get(endpoint)
      .set({ Authorization: `Bearer ${access_token}` })

    return response
  } catch (e) {
    throw e
  }
}

Deal.create = async function (params) {
  const { data, access_token } = params

  try {
    const response = await agent
      .post(`${config.api_url}/deals`)
      .set({ Authorization: `Bearer ${access_token}` })
      .send(data)

    return response
  } catch (e) {
    throw e
  }
}

Deal.getSubmissions = async function (params) {
  const { id, access_token } = params
  const endpoint = `${config.api_url}/deals/${id}/submissions`

  try {
    const response = await agent
      .get(endpoint)
      .set({ Authorization: `Bearer ${access_token}` })

    return response
  } catch (e) {
    throw e
  }
}

Deal.getEnvelopes = async function (params) {
  const { id, access_token } = params
  const endpoint = `${config.api_url}/deals/${id}/envelopes`

  try {
    const response = await agent
      .get(endpoint)
      .set({ Authorization: `Bearer ${access_token}` })

    return response
  } catch (e) {
    throw e
  }
}

Deal.uploadFile = async function(params) {
  const { id, file, access_token } = params
  const endpoint = `${config.api_url}/deals/${id}/files`

  try {
    const response = await agent
      .post(endpoint)
      .set({ Authorization: `Bearer ${access_token}` })
      .attach(file.name, file)

    return response
  } catch (e) {
    throw e
  }
}

Deal.getForms = async function (params) {
  const response = await agent
    .get(`${config.api_url}/forms`)
    .set({ Authorization: `Bearer ${params.token}` })

  return response
}

Deal.getSubmissionForm = async function(params) {
  const response = await agent
    .get(`${config.api_url}/forms/submissions/revisions/${params.id}`)
    .set({ Authorization: `Bearer ${params.access_token}` })

  return response
}

Deal.resendEnvelopeDocs = async function (id, access_token) {
  try {
    const response = await agent
      .post(`${config.api_url}/envelopes/${id}/resend`)
      .set({ Authorization: `Bearer ${access_token}` })

    return response.body
  } catch (e) {
    throw e
  }
}

Deal.collectSignatures = async function(params) {
  const { deal_id, subject, documents, recipients, access_token } = params

  const data = {
    deal: deal_id,
    title: subject,
    documents: _.map(documents, doc => ({ revision: doc.last_revision })),
    recipients: _.map(recipients, recipient => recipient)
  }

  try {
    const response = await agent
      .post(`${config.api_url}/envelopes`)
      .set({ Authorization: `Bearer ${access_token}` })
      .send(data)

    return response
  } catch (e) {
    throw e
  }
}

Deal.saveSubmissionForm = async function(params) {
  let endpoint
  const { deal_id, state, values, form, type, submission } = params

  // ge method
  const method = (type === 'update') ? 'put' : 'post'

  // initialize data to send
  const data = { state, values }

  if (type === 'create') {
    data.form = form
    endpoint = `${api_host}/deals/${deal_id}/submissions`
  } else {
    endpoint = `${api_host}/forms/submissions/${submission}`
  }

  try {
    const request = new Fetch()
    const response = await request[method](endpoint).send(data)

    return response
  } catch (e) {
    throw e
  }
}

Deal.searchPlaces = async function(address) {
  try {
    const params = `address=${address}&region=us&components=administrative_area:texas` +
      `&key=${config.google.api_key}`

    const response = await agent
      .get(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)

    return response.body
  }
  catch(e) {
    throw e
  }
}

Deal.searchListings = async function (address) {
  try {
    const response = await agent
      .get(`${config.app.url}/api/listings/search?q=${address}`)

    return response.body
  }
  catch(e) {
    throw e
  }
}

export default Deal


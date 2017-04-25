import agent from 'superagent'
import _ from 'underscore'
import config from '../../config/public'

const Deal = {}

// set api host
const api_host = config.api_url

Deal.getDeals = async function (params) {
  const { access_token } = params
  const endpoint = `${api_host}/deals?associations=deal.listing`

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
      .post(`${config.api_url}/deals?associations=deal.listing`)
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

Deal.collectSignatures = async function(deal_id, subject, documents, recipients, access_token) {
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

    return response.body
  } catch (e) {
    throw e
  }
}

Deal.saveSubmissionForm = async function(params) {
  try {
    const response = await agent
      .post(`${config.app.url}/api/deals/submission/form?access_token=${params.access_token}`)
      .send({
        deal: params.deal_id,
        state: params.state,
        values: params.values,
        form: params.form,
        type: params.type,
        submission: params.submission
      })

    return response.body
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


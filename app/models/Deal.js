import agent from 'superagent'
import _ from 'underscore'
import config from '../../config/public'
import Fetch from '../services/fetch'


const Deal = {
  get: {}
}

/**
* a helper that extracts a field from context or proposed values
*/
Deal.get.field = function(deal, field) {
  const contexts = ['mls_context', 'form_context', 'deal_context']
  const values = {}

  contexts.forEach(ctx => {
    values[ctx] = deal[ctx] && deal[ctx][field] ? deal[ctx][field] : null
  })

  const { mls_context, form_context, deal_context } = values

  let value = null

  if (mls_context) {
    value = mls_context
  } else if (form_context && deal_context) {
    value = form_context.created_at > deal_context.created_at ? form_context.value : deal_context.value
  } else if (form_context && !deal_context) {
    value = form_context.value
  } else if (deal_context && !form_context){
    value = deal_context.value
  }

  return value
}

/**
* a helper that extracts address from deal
*/
Deal.get.address = function(deal) {
  const street_name = Deal.get.field(deal, 'street_name')
  const street_address = Deal.get.field(deal, 'street_address')

  return (street_name + ' ' + street_address).trim()
}

/**
* get deals list
*/
Deal.getAll = async function(user = {}, backoffice = false) {
  const { access_token } = user
  let endpoint
  let associations

  // backoffice and agent has different endpoints and associations
  if (backoffice) {
    endpoint = `/brands/${user.brand}/deals/inbox`
    associations =  'associations[]=room.attachments&'
    associations += 'associations[]=deal.brand&'
    associations += 'associations[]=deal.created_by&'
    associations += 'associations[]=review.updated_by'
  } else {
    endpoint = `/brands/${user.brand}/deals`
    associations = 'associations[]=room.attachments'
  }

  try {
    const fetchDeals = new Fetch()
      .get(`${endpoint}?${associations}`)

    // required on ssr
    if (access_token) {
      fetchDeals.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await fetchDeals
    return response.body.data

  } catch (e) {
    throw e
  }
}

/**
* get forms list
*/
Deal.getForms = async function() {
  try {
    const response = await new Fetch()
      .get('/forms')

    return response.body.data

  } catch (e) {
    console.log(e)
  }
}

/**
* add a form
*/
Deal.addForm = async function (brandId, checklistId, formId) {
  try {
    const response = await new Fetch()
      .post(`/brands/${brandId}/checklists/${checklistId}/forms`)
      .send({ form: formId })
    return response.body.data
  } catch (e) {
    console.log(e)
  }
}

/**
 * delete a form
 */
Deal.deleteForm = async function (checklist, formId) {
  try {
    return await new Fetch().delete(`/brands/${checklist.brand}/checklists/${checklist.id}/forms/${formId}`)
  } catch (e) {
    return null
  }
}

/**
* search google places
*/
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

/**
* search listings
*/
Deal.searchListings = async function (address) {
  try {
    const response = await new Fetch()
      .get(`/listings/search?q=${address}`)

    return response.body
  }
  catch(e) {
    throw e
  }
}

/**
* create new deal
*/
Deal.create = async function (data) {
  try {
    const response = await new Fetch()
      .post('/deals')
      .send(data)

    return response.body.data
  } catch (e) {
    console.log(e)
    throw e
  }
}

/**
 * save submission
 */
Deal.saveSubmission = async function(id, form, state, values) {
  try {
    const response = await new Fetch()
      .put(`/tasks/${id}/submission`)
      .send({
        state,
        form,
        values
      })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * get submission form
 */
Deal.getSubmissionForm = async function(task_id, last_revision) {
  try {
    const response = await new Fetch()
      .get(`/tasks/${task_id}/submission/${last_revision}`)

    return response.body.data
  } catch (e) {
    return null
  }
}

/**
* create new task
*/
Deal.createTask = async function (deal_id, form, title, status, task_type, checklist) {
  try {
    const response = await new Fetch()
      .post(`/deals/${deal_id}/tasks`)
      .send({ title, status, task_type, checklist, form })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* add new role
*/
Deal.createRole = async function (deal_id, form) {
  const { first_name, last_name, email, role } = form

  try {
    const response = await new Fetch()
      .post(`/deals/${deal_id}/roles`)
      .send({ first_name, last_name, email, role })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* change task status
*/
Deal.changeTaskStatus = async function(task_id, status) {
  try {
    await new Fetch()
      .put(`/tasks/${task_id}/review`)
      .send({ status })

  } catch (e) {
    return false
  }
}

/**
* set notify admin flag
*/
Deal.needsAttention = async function(task_id, status) {
  try {
    await new Fetch()
      .patch(`/tasks/${task_id}/needs_attention`)
      .send({ needs_attention: status })

  } catch (e) {
    return false
  }
}

/**
* get envelopes of a deal
*/
Deal.getEnvelopes = async function(deal_id) {
  try {
    const response = await new Fetch()
      .get(`/deals/${deal_id}/envelopes`)

    return response.body.data
  } catch (e) {
    return null
  }
}

/**
* send envelope
*/
Deal.sendEnvelope = async function(deal_id, subject, message, attachments, recipients) {

  const data = {
    deal: deal_id,
    title: subject,
    message: message,
    documents: attachments,
    recipients: _.map(recipients, recipient => recipient)
  }

  try {
    const response = await new Fetch()
      .post(`/envelopes`)
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default Deal

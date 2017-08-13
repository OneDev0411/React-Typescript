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
Deal.getAll = async function(user = {}) {
  const { access_token } = user

  try {
    const fetchDeals = new Fetch()
      .get('/deals?associations[]=room.attachments')

    // required on ssr
    if (access_token) {
      fetchDeals.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await fetchDeals
    return response.body.data

  } catch (e) {
    console.log(e)
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
* submit a task for review
*/
Deal.submitForReview = async function(task_id) {
  try {
    await new Fetch()
      .put(`/tasks/${task_id}/review`)
      .send({ status: 'Pending' })

    await new Fetch()
      .patch(`/tasks/${task_id}/needs_attention`)
      .send({ needs_attention: true })

  } catch (e) {
    return false
  }
}

/**
* cancel a task for review
*/
Deal.cancelTaskReview = async function(task_id) {
  try {
    await new Fetch()
      .put(`/tasks/${task_id}/review`)
      .send({ status: 'New' })

    await new Fetch()
      .patch(`/tasks/${task_id}/needs_attention`)
      .send({ needs_attention: false })

  } catch (e) {
    return false
  }
}

export default Deal

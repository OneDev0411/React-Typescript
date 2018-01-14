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
Deal.get.context = function (deal, field) {
  if (!deal) {
    return null
  }

  const contexts = ['mls_context', 'deal_context']
  const values = {}

  contexts.forEach(ctx => {
    values[ctx] = deal[ctx] && deal[ctx][field] ? deal[ctx][field] : null
  })

  const { mls_context, deal_context } = values

  // mls context has priority over deal context, when there is no deal context
  if (mls_context && !deal_context) {
    return mls_context
  } else if (deal_context) {
    return deal_context
  }

  return null
}

/**
* a helper that extracts a field from context or proposed values
*/
Deal.get.field = function (deal, field) {
  const context = Deal.get.context(deal, field)

  let value = null

  if (!context) {
    return value
  }

  if (typeof context !== 'object') {
    return context
  }

  if (typeof context === 'object' && context.type === 'deal_context_item') {
    const { context_type } = context

    return context[context_type.toLowerCase()]
  }

  return value
}


/**
* a helper that extracts address from deal
*/
Deal.get.address = function (deal, roles) {
  if (deal.listing) {
    return deal.mls_context.full_address
  }

  const unitNumber = Deal.get.field(deal, 'unit_number')
  const city = Deal.get.field(deal, 'city')
  const state = Deal.get.field(deal, 'state')
  const postalCode = Deal.get.field(deal, 'postal_code')

  const address = [
    Deal.get.field(deal, 'street_number') || '',
    Deal.get.field(deal, 'street_name') || '',
    Deal.get.field(deal, 'street_suffix') || '',
    unitNumber ? `, #${unitNumber},` : '',
    city ? `, ${city}` : '',
    state ? `, ${state}` : '',
    postalCode ? `, ${postalCode}` : ''
  ]
    .join(' ')
    .trim()
    .replace(/(\s)+,/ig, ',')
    .replace(/,,/ig, ',')

  if (address.slice('-1') === ',') {
    return address.slice(0, -1)
  }

  if (address.length === 0) {
    return Deal.get.clientNames(deal, roles)
  }

  return address
}

Deal.get.status = function (deal) {
  return deal.deleted_at ? 'Archived' : Deal.get.field(deal, 'listing_status')
}

Deal.get.clientNames = function (deal, roles) {
  const allowedRoles = deal.deal_type === 'Buying' ? ['Buyer', 'Tenant'] : ['Seller', 'Landlord']
  const clients = []

  if (!deal.roles || !roles) {
    return ''
  }

  deal.roles.forEach(role => {
    let item = roles[role]

    if (allowedRoles.indexOf(item.role) > -1) {
      if (item.user) {
        clients.push(item.user.display_name)
      } else {
        clients.push(`${item.legal_first_name} ${item.legal_last_name}`)
      }
    }
  })

  return clients.join(', ')
}

/**
* a helper that formats price
*/
Deal.get.formattedPrice = function (number, style = 'currency') {
  if (!number) {
    return number
  }

  return new Intl.NumberFormat('en-US', {
    style,
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(number)
}

/**
* get deal sise
*/
Deal.get.side = function (deal) {
  const sides = {
    Buying: 'Buyer',
    Selling: 'Seller'
  }

  return sides[deal.deal_type]
}

/**
* get deal by id
*/
Deal.getById = async function (id) {
  try {
    const response = await new Fetch()
      .get(`/deals/${id}`)
      .query({'associations[]': ['room.attachments']})
      .query({'associations[]': ['deal.checklists']})
      .query({'associations[]': ['deal.envelopes']})

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* get deals list
*/
Deal.getAll = async function (user = {}, backoffice = false) {
  const { access_token } = user
  let endpoint
  let associations

  if (!user.brand) {
    throw new Error('This user does not belong to any brand')
  }

  // backoffice and agent has different endpoints and associations
  if (backoffice) {
    endpoint = `/brands/${user.brand}/deals/inbox`
    associations = 'associations[]=deal.brand&'
    associations += 'associations[]=deal.created_by&'
    associations += 'associations[]=review.updated_by&'
    associations += 'associations[]=deal.new_notifications'
  } else {
    endpoint = `/brands/${user.brand}/deals`
    associations = 'associations[]=agent.office&'
    associations += 'associations[]=deal.new_notifications'
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
* get contexts info
*/
Deal.getContexts = async function() {
  try {
    const response = await new Fetch()
      .get('/deals/contexts')

    return response.body.data
  } catch (e) {
    console.log(e)
  }
}

/**
* get forms list
*/
Deal.getForms = async function () {
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
  if (!brandId) {
    throw new Error('This user does not belong to any brand')
  }

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
  if (!checklist.brand) {
    throw new Error('This user does not belong to any brand')
  }

  try {
    await new Fetch()
      .delete(`/brands/${checklist.brand}/checklists/${checklist.id}/forms/${formId}`)
  } catch (e) {
    return null
  }
}

/**
 * delete attachment
 */
Deal.deleteAttachment = async function (roomId, fileId) {
  try {
    await new Fetch()
      .delete(`/rooms/${roomId}/attachments/${fileId}`)
  } catch (e) {
    throw e
  }
}

/**
 * archive a deal
 */
Deal.archiveDeal = async function (dealId) {
  try {
    await new Fetch()
      .delete(`/deals/${dealId}`)
  } catch (e) {
    throw e
  }
}

/**
* search google places
*/
Deal.searchPlaces = async function (address) {
  try {
    const params = `address=${address}&region=us&components=administrative_area:texas` +
      `&key=${config.google.api_key}`

    const response = await agent
      .get(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)

    return response.body
  } catch (e) {
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
  } catch (e) {
    throw e
  }
}

/**
* create new deal
*/
Deal.create = async function (user, data) {
  try {
    const response = await new Fetch()
      .post('/deals?associations[]=deal.checklists')
      .set('X-RECHAT-BRAND', user.brand)
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * save submission
 */
Deal.saveSubmission = async function (id, form, state, values) {
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
Deal.getSubmissionForm = async function (task_id, last_revision) {
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
Deal.createTask = async function (dealId, data) {
  try {
    const response = await new Fetch()
      .post(`/deals/${dealId}/tasks`)
      .send(data)
      .send({ is_deletable: true })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* delete task
*/
Deal.deleteTask = async function (taskId) {
  try {
    const response = await new Fetch()
      .delete(`/tasks/${taskId}`)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* delete task
*/
Deal.updateTask = async function (taskId, attributes) {
  try {
    const response = await new Fetch()
      .patch(`/tasks/${taskId}`)
      .send(attributes)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* update checklist
*/
Deal.updateChecklist = async function (deal_id, checklist_id, attributes) {
  try {
    const response = await new Fetch()
      .put(`/deals/${deal_id}/checklists/${checklist_id}`)
      .send(attributes)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* update listing
*/
Deal.updateListing = async function (dealId, listingId) {
  try {
    const response = await new Fetch()
      .patch(`/deals/${dealId}/listing`)
      .send({ listing: listingId })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* add new role
*/
Deal.createRole = async function (deal_id, roles) {
  try {
    const response = await new Fetch()
      .post(`/deals/${deal_id}/roles`)
      .send({ roles })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* update a role
*/
Deal.updateRole = async function (deal_id, role) {
  try {
    const response = await new Fetch()
      .put(`/deals/${deal_id}/roles/${role.id}`)
      .send(role)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* delete role
*/
Deal.deleteRole = async function (deal_id, role_id) {
  try {
    await new Fetch()
      .delete(`/deals/${deal_id}/roles/${role_id}`)

    return true
  } catch (e) {
    throw e
  }
}

/**
* create a new offer
*/
Deal.createOffer = async function (deal_id, name, order, is_backup, property_type) {
  try {
    const response = await new Fetch()
      .post(`/deals/${deal_id}/checklists/offer`)
      .send({
        checklist: {
          title: `Offer (${name})`,
          is_deactivated: is_backup,
          order
        },
        conditions: {
          deal_type: 'Buying',
          property_type
        }
      })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* change task status
*/
Deal.changeTaskStatus = async function (task_id, status) {
  try {
    await new Fetch()
      .put(`/tasks/${task_id}/review`)
      .send({ status })
  } catch (e) {
    return false
  }
}

/**
* set notify office flag
*/
Deal.needsAttention = async function (task_id, status) {
  try {
    await new Fetch()
      .patch(`/tasks/${task_id}/needs_attention`)
      .send({ needs_attention: status })
  } catch (e) {
    return false
  }
}

/**
* bulk submit for review
*/
Deal.bulkSubmit = async function bulkSubmit(dealId, tasks) {
  try {
    const response = await new Fetch()
      .put(`/deals/${dealId}/tasks`)
      .send(tasks)

    return response.body.data
  } catch (e) {
    return false
  }
}

/**
* update deal context
*/
Deal.updateContext = async function (dealId, context, approved) {
  try {
    const response = await new Fetch()
      .post(`/deals/${dealId}/context`)
      .send({
        context,
        approved
      })

    return response.body.data
  } catch (e) {
    return false
  }
}

/**
* resend specific envelope
*/
Deal.resendEnvelope = async function (id) {
  try {
    const response = await new Fetch()
      .post(`/envelopes/${id}/resend`)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* send envelope
*/
Deal.sendEnvelope = async function (deal_id, subject, message, attachments, recipients) {
  const data = {
    deal: deal_id,
    title: subject,
    body: message,
    documents: attachments,
    recipients: _.map(recipients, recipient => recipient)
  }

  try {
    const response = await new Fetch()
      .post('/envelopes')
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* void envelope
*/
Deal.voidEnvelope = async function (envelope_id) {
  try {
    const response = await new Fetch()
      .patch(`/envelopes/${envelope_id}/status`)
      .send({ status: 'Voided' })

    return response.body.data
  } catch (e) {
    return null
  }
}

/**
* split files
*/
Deal.splitPDF = async function (title, room_id, files, pages) {
  try {
    const request = agent
      .post(`${config.app.url}/api/deals/pdf-splitter`)
      .field({ pages: JSON.stringify(pages) })
      .field({ title })
      .field({ room_id })

    files.forEach(file => {
      request.attach(file.id, file, `${file.id}.pdf`)
    })

    // send request
    const response = await request

    return response.body
  } catch (e) {
    throw e
  }
}

/**
 * get all agents of brand
 */
Deal.getAgents = async function (user) {
  if (!user.brand) {
    throw new Error('This user does not belong to any brand')
  }

  try {
    const response = await new Fetch()
      .get(`/brands/${user.brand}/agents`)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * Search through all deals
 */
Deal.searchAllDeals = async function (query) {
  try {
    const response = await new Fetch()
      .post('/deals/filter')
      .send({ query })

    return response.body.data
  } catch (error) {
    return { error }
  }
}

export default Deal

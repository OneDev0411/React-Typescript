import Fetch from '../../../services/fetch'

const defaultQuery = { 'associations[]': 'crm_task.reminders' }

export async function getContactTimeline(contactId, query = defaultQuery) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  try {
    const response = await new Fetch()
      .get(`/contacts/${contactId}/timeline`)
      .query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}

import Fetch from '../../../services/fetch'

import { CRM_TASKS_QUERY } from '../helpers/default-query'

export default async function getContactTimeline(
  contactId,
  query = CRM_TASKS_QUERY
) {
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

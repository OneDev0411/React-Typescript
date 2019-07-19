import Fetch from '../../services/fetch'

/**
 * Add some associations to a CRM flow.
 * @param {Object} body - A CRM Flow.
 * @returns {nothing} Returns 204.
 */

export async function addToFlow(body) {
  try {
    const response = await new Fetch().post('/crm/flows').send(body)

    return response.body
  } catch (error) {
    throw error
  }
}

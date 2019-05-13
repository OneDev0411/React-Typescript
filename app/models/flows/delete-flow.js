import Fetch from '../../services/fetch'

/**
 * Deleting a flow instance.
 * @param {string} id The flow instance id.
 * @returns {object} Returns response - actually nothing. it returns 204.
 */

export default async function deleteFlow(id) {
  if (!id) {
    throw new Error('Flow id is undefined.')
  }

  try {
    return new Fetch().delete(`/crm/flows/${id}`)
  } catch (error) {
    throw error
  }
}

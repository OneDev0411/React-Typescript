import Fetch from '../../../services/fetch'

/**
 * Fetch all associations of a touch.
 * @param {UUID} touchId The touch id.
 * @param {object|string} query The request query strings.
 * @returns {array} Returns associations.
 */
export async function getTouchAssociations(touchId, query = {}) {
  if (!touchId) {
    throw new Error('Touch id is required.')
  }

  try {
    const response = await new Fetch()
      .get(`/crm/touches/${touchId}/associations`)
      .query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}

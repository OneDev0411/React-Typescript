import Fetch from '../../../services/fetch'

/**
 * Get a touch.
 * @param {UUID} touchId The touch id.
 * @param {object|string} query The request query strings.
 * @returns {object} Returns a touch.
 */
export async function getTouch(touchId, query = {}) {
  if (!touchId) {
    throw new Error('Task id is required.')
  }

  try {
    const response = await new Fetch()
      .get(`/crm/touches/${touchId}`)
      .query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}

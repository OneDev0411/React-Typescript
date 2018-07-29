import Fetch from '../../../services/fetch'

/**
 * Create a new CRM touch.
 * @param {object} touch The new touch data.
 * @param {object|string} query The request query strings.
 * @returns {object} Returns new touch.
 */

export async function createTouch(touch, query = {}) {
  if (!touch || Object.keys(touch).length === 0) {
    throw new Error('New touch has not any data.')
  }

  try {
    const response = await new Fetch()
      .post('/crm/touches')
      .send(touch)
      .query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}

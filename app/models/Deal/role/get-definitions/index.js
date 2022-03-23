import Fetch from '../../../../services/fetch'

/**
 * get roles definitions
 */
export async function getDefinitions() {
  try {
    const response = await new Fetch().get('/deals/roles/definitions')

    return response.body.data
  } catch (e) {
    throw e
  }
}

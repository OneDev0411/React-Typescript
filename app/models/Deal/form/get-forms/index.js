import Fetch from '../../../../services/fetch'

/**
 * get forms list
 */
export async function getForms() {
  try {
    const response = await new Fetch().get('/forms')

    return response.body.data
  } catch (e) {
    console.log(e)
  }
}

import Fetch from '../../../../services/fetch'

/**
 * get contexts info
 */
export async function getContexts(user = {}) {
  const { access_token } = user

  try {
    const request = new Fetch().get('/deals/contexts')

    // required on ssr
    if (access_token) {
      request.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await request

    return response.body.data
  } catch (e) {
    return null
  }
}

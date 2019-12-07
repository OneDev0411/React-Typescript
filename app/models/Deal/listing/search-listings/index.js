import Fetch from '../../../../services/fetch'

/**
 * search listings
 */
export async function searchListings(criteria) {
  const isMlsNumber = /^[0-9]{5,8}$/.test(criteria)
  const queryName = isMlsNumber ? 'mls_number' : 'q'

  try {
    const response = await new Fetch().get(
      `/listings/search?${queryName}=${encodeURIComponent(criteria)}`
    )

    return response.body.data
  } catch (e) {
    throw e
  }
}

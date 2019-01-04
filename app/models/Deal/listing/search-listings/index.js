import Fetch from '../../../../services/fetch'

/**
 * search listings
 */
export async function searchListings(criteria) {
  let queryName = 'q'
  const isMlsNumber = /^[0-9]{5,8}$/.test(criteria)
  const normalizeMlsObject = data => ({
    ...data.property,
    id: data.id,
    is_mls_search: true,
    price: data.price,
    status: data.status,
    cover_image_url: data.cover_image_url
  })

  try {
    if (isMlsNumber) {
      queryName = 'mls_number'
    }

    const response = await new Fetch().get(
      `/listings/search?${queryName}=${encodeURIComponent(criteria)}`
    )

    const { data } = response.body

    return isMlsNumber ? [normalizeMlsObject(data)] : data
  } catch (e) {
    throw e
  }
}

import agent from 'superagent'
import Fetch from '../../services/fetch'
import config from '../../../config/public'

/**
 * search google places
 */
export async function searchPlaces(address) {
  try {
    const params =
      `address=${address}&region=us&components=administrative_area:texas` +
      `&key=${config.google.api_key}`

    const response = await agent.get(
      `https://maps.googleapis.com/maps/api/geocode/json?${params}`
    )

    return response.body
  } catch (e) {
    throw e
  }
}

/**
 * search listings
 */
export async function searchListings(criteria) {
  let queryName = 'q'
  const isMlsNumber = /\b[0-9]{5,8}\b/.test(criteria)
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
      `/listings/search?${queryName}=${criteria}`
    )

    const { data } = response.body

    return isMlsNumber ? [normalizeMlsObject(data)] : data
  } catch (e) {
    throw e
  }
}

export default {
  searchPlaces,
  searchListings
}

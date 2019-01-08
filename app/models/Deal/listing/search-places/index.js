import agent from 'superagent'

import config from '../../../../../config/public'

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

import config from '../../../../config/public'

export async function getPlaces(
  address: string
): Promise<google.maps.GeocoderResult[]> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.google.api_key}&address=${address}`
    const response = await fetch(url)

    const parsedResponse: {
      results: google.maps.GeocoderResult[]
    } = await response.json()

    return parsedResponse.results
  } catch (error) {
    throw error
  }
}

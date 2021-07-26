import config from '../../../../config/public'

export interface CompactPlace {
  zoom: number
  center: google.maps.LatLngLiteral
}

export function getPlace(address: string, compact?: true): Promise<CompactPlace>

export function getPlace(
  address: string,
  compact?: false
): Promise<google.maps.GeocoderResult>

export async function getPlace(address: string, compact: boolean = true) {
  try {
    // eslint-disable-next-line max-len
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.google.api_key}&address=${address}`
    const response = await fetch(url)

    if (response.status < 200 || response.status >= 300) {
      return null
    }

    const parsedResponse: {
      results: google.maps.GeocoderResult[]
    } = await response.json()

    if (parsedResponse.results.length === 0) {
      return null
    }

    const result = parsedResponse.results[0]

    if (compact) {
      return {
        zoom: 15,
        center: result.geometry.location as unknown as google.maps.LatLngLiteral
      }
    }

    return result
  } catch (error) {
    throw error
  }
}

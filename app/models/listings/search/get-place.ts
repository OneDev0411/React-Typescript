import config from '../../../../config/public'

export interface CompactPlace {
  zoom: number
  center: google.maps.LatLng
}

export function getPlace(address: string, compact?: true): Promise<CompactPlace>

export function getPlace(
  address: string,
  compact?: false
): Promise<google.maps.GeocoderResult>

export async function getPlace(address: string, compact: boolean = true) {
  try {
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
        zoom: 16,
        center: result.geometry.location
      }
    }

    return result
  } catch (error) {
    throw error
  }
}

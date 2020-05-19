import config from '../../../../config/public'

const getPlace = async (address, compact = true) => {
  if (!address) {
    return null
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.google.api_key}&address=${address}`
    const request = new Request(url, {
      method: 'GET'
    })

    const response = await fetch(request)

    if (response.status >= 200 && response.status < 300) {
      const parsedResponse = await response.json()
      const result = parsedResponse.results[0]

      if (result) {
        if (!compact) {
          return result
        }

        return {
          zoom: 16,
          center: result.geometry.location
        }
      }
    }

    return null
  } catch (error) {
    throw error
  }
}

export default getPlace

const getPlace = async (address) => {
  if (!address) {
    return
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}`
    const request = new Request(url, {
      method: 'GET'
    })

    const response = await fetch(request)

    if (response.status >= 200 && response.status < 300) {
      const parsedResponse = await response.json()
      const geocode = parsedResponse.results[0]

      if (!geocode) {
        return
      }

      const center = {
        lat: geocode.geometry.location.lat,
        lng: geocode.geometry.location.lng
      }
      const zoom = 16

      return {
        zoom,
        center
      }
    }
  } catch (error) {
    throw error
  }
}

export default getPlace

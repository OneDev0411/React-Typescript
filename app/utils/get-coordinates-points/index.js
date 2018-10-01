const calculatePointsFromBounds = bounds => {
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()

  const southWest = new window.google.maps.LatLng(sw.lat(), sw.lng())
  const northEast = new window.google.maps.LatLng(ne.lat(), ne.lng())
  const southEast = new window.google.maps.LatLng(sw.lat(), ne.lng())
  const northWest = new window.google.maps.LatLng(ne.lat(), sw.lng())

  return [northEast, northWest, southWest, southEast, northEast].map(point => ({
    latitude: point.lat(),
    longitude: point.lng()
  }))
}

export const getMapBoundsInCircle = (center, radius = 3) => {
  if (!window.google) {
    throw new Error('Google api not found!')
  }

  if (!center) {
    return 0
  }

  const circle = new window.google.maps.Circle({
    center,
    radius: radius * 1609.34
  })

  return calculatePointsFromBounds(circle.getBounds())
}

export const getMapPointsWithBounds = bounds => {
  if (!bounds) {
    return 0
  }

  const { northeast, southwest } = bounds

  return calculatePointsFromBounds(
    new window.google.maps.LatLngBounds(northeast, southwest)
  )
}

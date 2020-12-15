export function calculatePointsFromBounds(bounds: google.maps.LatLngBounds): IPoint[] {
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

export function getMapBoundsInCircle(
  center: google.maps.LatLng | google.maps.LatLngLiteral,
  radius?: number,
  returnBounds?: false
): IPoint[]

export function getMapBoundsInCircle(
  center: google.maps.LatLng | google.maps.LatLngLiteral,
  radius?: number,
  returnBounds?: true
): { points: IPoint[], bounds: google.maps.LatLngBounds }

export function getMapBoundsInCircle(
  center: google.maps.LatLng | google.maps.LatLngLiteral,
  radius: number = 3,
  returnBounds: boolean = false
) {
  if (!window.google) {
    throw new Error('Google api not found!')
  }

  const circle = new window.google.maps.Circle({
    center,
    radius: radius * 1609.34
  })

  if (returnBounds) {
    const bounds = circle.getBounds()

    return {
      bounds,
      points: calculatePointsFromBounds(bounds)
    }
  }

  return calculatePointsFromBounds(circle.getBounds())
}


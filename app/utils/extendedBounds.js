import { fitBounds } from 'google-map-react/utils'

export const getBounds = points => {
  const googleMapsLatLngBounds = new google.maps.LatLngBounds()
  points.forEach(point => googleMapsLatLngBounds.extend(point))

  // The condition checked that if all points have the same coordinates,
  // the map transferred to a decluster zoom level.
  if (
    googleMapsLatLngBounds.getSouthWest().toString() ===
    googleMapsLatLngBounds.getNorthEast().toString()
  ) {
    return false
  }

  const ne = {
    lat: googleMapsLatLngBounds.getNorthEast().lat(),
    lng: googleMapsLatLngBounds.getNorthEast().lng()
  }
  const sw = {
    lat: googleMapsLatLngBounds.getSouthWest().lat(),
    lng: googleMapsLatLngBounds.getSouthWest().lng()
  }

  const getNw = new google.maps.LatLng(ne.lat.toString(), sw.lng.toString())
  const getSe = new google.maps.LatLng(sw.lat, ne.lng)

  const nw = {
    lat: getNw.lat(),
    lng: getNw.lng()
  }
  const se = {
    lat: getSe.lat(),
    lng: getSe.lng()
  }

  return {
    ne,
    sw,
    nw,
    se
  }
}

export const getExtededMapProps = (mapProps, bounds) => {
  const { ne, sw, nw, se } = bounds

  const { size = { width: 600, height: 480 } } = mapProps

  let { zoom, center } = fitBounds({ ne, sw }, size)

  if (zoom === mapProps.zoom) {
    zoom++
  }

  return {
    zoom,
    center,
    bounds: { nw, se }
  }
}

const extendedBounds = (points, mapProps) => {
  const bounds = getBounds(points)

  if (!bounds) {
    return false
  }

  return getExtededMapProps(mapProps, bounds)
}

export default extendedBounds

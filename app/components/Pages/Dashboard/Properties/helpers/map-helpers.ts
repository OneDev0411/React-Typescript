import { Theme } from '@material-ui/core'
import { Coords, Maps, MapOptions } from 'google-map-react'

export const createMapOptions = (
  maps: Maps,
  drawingMode: boolean
): MapOptions => {
  // following props are exposed at maps arg

  // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
  // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
  // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
  // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
  // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
  return {
    zoomControlOptions: {
      position: maps.ControlPosition.RIGHT_BOTTOM
    },
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite'],
      position: maps.ControlPosition.LEFT_BOTTOM
    },
    streetViewControlOptions: {
      position: maps.ControlPosition.RIGHT_BOTTOM
    },
    // Show/hide controls based on different modes.
    // I know it's !drawingMode, have written like this for clarity
    // and also in case we have other modes for map later
    mapTypeControl: !drawingMode,
    streetViewControl: !drawingMode,
    fullscreenControl: false,
    scaleControl: true
  }
}

export const createMapPolygonOptions = (theme: Theme) => {
  return {
    zIndex: 1,
    strokeWeight: 3,
    fillOpacity: 0.3,
    fillColor: theme.palette.primary.main,
    strokeColor: theme.palette.primary.main
  }
}

export const pointsFromPolygon = (polygon: google.maps.Polygon): Coords[] => {
  const points = polygon
    .getPath()
    .getArray()
    .map(point => {
      const coords: Coords = {
        lat: point.lat(),
        lng: point.lng()
      }

      return coords
    })

  return [...points, points[0]]
}

export const coordToPoint = (coord: Coords): IPoint => {
  return { latitude: coord.lat, longitude: coord.lng }
}

export const pointFromBounds = (
  bounds?: Nullable<IBounds>
): Nullable<IPoint[]> => {
  if (!bounds) {
    return null
  }

  return [
    { latitude: bounds.ne.lat, longitude: bounds.ne.lng },
    { latitude: bounds.se.lat, longitude: bounds.se.lng },
    { latitude: bounds.sw.lat, longitude: bounds.sw.lng },
    { latitude: bounds.nw.lat, longitude: bounds.nw.lng },
    { latitude: bounds.ne.lat, longitude: bounds.ne.lng }
  ]
}

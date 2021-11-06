import { Theme } from '@material-ui/core'
import { Coords, Maps, MapOptions } from 'google-map-react'

import { appSidenavWidth } from '../../SideNav/variables'
import {
  GOOGLE_MAP_GLOBE_WIDTH,
  GOOGLE_MAP_MAX_ZOOM_LEVEL,
  MLS_MAP_Height_GAP,
  MLS_MAP_WIDTH_GAP,
  PLACE_ZOOM_OFFSETS
} from '../constants'

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
  bounds?: Nullable<ICompactBounds>
): Nullable<IPoint[]> => {
  if (!bounds) {
    return null
  }

  return [
    { latitude: bounds.ne.lat, longitude: bounds.ne.lng },
    { latitude: bounds.sw.lat, longitude: bounds.ne.lng },
    { latitude: bounds.sw.lat, longitude: bounds.sw.lng },
    { latitude: bounds.ne.lat, longitude: bounds.sw.lng },
    { latitude: bounds.ne.lat, longitude: bounds.ne.lng }
  ]
}

export const estimateMapZoom = (
  bounds: ICompactBounds,
  offset: number = 0,
  mapWidth?: number,
  mapHeight?: number
): number => {
  const gapWidth = MLS_MAP_WIDTH_GAP
  const gapHeight = MLS_MAP_Height_GAP

  const estimatedMapWidth =
    mapWidth ?? (window.innerWidth - appSidenavWidth - gapWidth) / 2
  const estimatedMapHight = mapHeight ?? window.innerHeight - gapHeight

  const WORLD_DIM = {
    height: GOOGLE_MAP_GLOBE_WIDTH,
    width: GOOGLE_MAP_GLOBE_WIDTH
  }

  function getLatRad(lat: number) {
    const sin = Math.sin((lat * Math.PI) / 180)
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2

    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
  }

  function getZoom(mapPx: number, worldPx: number, fraction: number) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2)
  }

  const ne = bounds.ne
  const sw = bounds.sw

  const latFraction = (getLatRad(ne.lat) - getLatRad(sw.lat)) / Math.PI

  const lngDiff = ne.lng - sw.lng
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360

  const latZoom = getZoom(estimatedMapHight, WORLD_DIM.height, latFraction)
  const lngZoom = getZoom(estimatedMapWidth, WORLD_DIM.width, lngFraction)

  const finalZoom = Math.min(
    latZoom + offset,
    lngZoom + offset,
    GOOGLE_MAP_MAX_ZOOM_LEVEL
  )

  return finalZoom
}

export const getPlaceZoomOffset = (types: string[]): number => {
  for (let i = 0; i < types.length; i++) {
    if (typeof PLACE_ZOOM_OFFSETS[types[i]] !== 'undefined') {
      return PLACE_ZOOM_OFFSETS[types[i]]
    }
  }

  return 0
}

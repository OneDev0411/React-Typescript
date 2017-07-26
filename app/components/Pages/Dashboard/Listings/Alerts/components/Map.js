import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import Brand from '../../../../../../controllers/Brand'
import Marker from '../../components/Markers/SimpleMarker'
import {
  setCssPositionToListingsWithSameBuilding,
  generatePointsFromBounds
} from '../../../../../../utils/map'
import {
  getBounds,
  getExtededMapProps
} from '../../../../../../utils/extendedBounds'
import * as actions from '../../../../../../store_actions/listings/map'

import { bootstrapURLKeys, mapOptions, mapInitialState } from '../../mapOptions'

const map = ({
  style,
  markers,
  appData,
  options,
  onChange,
  defaultZoom,
  defaultCenter,
  bootstrapURLKeys,
  onGoogleApiLoaded,
  onMarkerMouseEnter,
  onMarkerMouseLeave,
  map: { hoveredMarkerId },
  mapProps: { zoom, center }
}) =>
  <Map
    zoom={zoom}
    style={style}
    center={center}
    options={options}
    onChange={onChange}
    defaultZoom={defaultZoom}
    defaultCenter={defaultCenter}
    yesIWantToUseGoogleMapApiInternals
    bootstrapURLKeys={bootstrapURLKeys}
    onGoogleApiLoaded={onGoogleApiLoaded}
  >
    {markers.map(({ points, lat, lng }) => {
      const { id } = points[0]
      return (
        <Marker
          lat={lat}
          lng={lng}
          data={appData}
          listing={points[0]}
          key={`MARKER_${id}`}
          onMouseEnterHandler={() => onMarkerMouseEnter(id)}
          onMouseLeaveHandler={() => onMarkerMouseLeave(id)}
          markerPopupIsActive={hoveredMarkerId === id}
        />
      )
    })}
  </Map>

let markersOverlay = null
const overlayColor = `#${Brand.color('primary', '3388ff')}`

const normalizePoints = points =>
  points.map(point => ({
    lat: point.latitude,
    lng: point.longitude
  }))

const drawingOverlay = points => {
  markersOverlay = new window.google.maps.Polygon({
    paths: points,
    zIndex: 1,
    strokeWeight: 5,
    fillOpacity: 0.35,
    fillColor: overlayColor,
    strokeColor: overlayColor
  })

  markersOverlay.setMap(window.currentMap)
}

const mapHOC = compose(
  defaultProps({
    defaultZoom: 13,
    bootstrapURLKeys,
    options: mapOptions,
    defaultCenter: mapInitialState.center,
    style: {
      position: 'relative',
      height: 'calc(100vh - 56px)'
    }
  }),
  connect(({ data, alerts }) => {
    const { map } = alerts
    return {
      map,
      appData: data,
      user: data.user,
      mapProps: map.props
    }
  }, actions),
  withState('googleMap', 'setGoogleMap', null),
  withHandlers({
    onGoogleApiLoaded: ({ markers, setGoogleMap }) => ({ map }) => {
      window.currentMap = map
      setGoogleMap(map)

      if (markersOverlay) {
        markersOverlay.setMap(map)
      }
    },
    onChange: ({ setMapProps }) => mapProps => {
      setMapProps('ALERTS', mapProps)
    },
    onMarkerMouseLeave: ({ setMapHoveredMarkerId }) => () => {
      setMapHoveredMarkerId('ALERTS', -1)
    },
    onMarkerMouseEnter: ({ setMapHoveredMarkerId }) => id => {
      setMapHoveredMarkerId('ALERTS', id)
    }
  }),
  withPropsOnChange(
    (props, nextProps) => !_.isEqual(props.markers, nextProps.markers),
    ({ markers = [], mapProps, setMapProps, selectedAlert, googleMap }) => {
      markers = setCssPositionToListingsWithSameBuilding(
        markers.map(marker => ({
          lat: marker.lat,
          lng: marker.lng,
          points: [marker]
        }))
      )

      if (markersOverlay && markers.length === 0) {
        markersOverlay.setMap(null)
        markersOverlay = null
        return { markers }
      }

      if (googleMap && mapProps.bounds && markers.length > 0) {
        if (markersOverlay) {
          markersOverlay.setMap(null)
          markersOverlay = null
        }

        let points
        const googleMaps = window.google.maps

        if (selectedAlert.points) {
          points = normalizePoints(selectedAlert.points)
        } else {
          const markersBounds = getBounds(markers)
          points = normalizePoints(generatePointsFromBounds(markersBounds))
        }

        const bounds = new googleMaps.LatLngBounds()
        points.forEach(point => bounds.extend(point))

        googleMap.fitBounds(bounds)

        drawingOverlay(points)
      }

      return { markers }
    }
  )
)

export default mapHOC(map)

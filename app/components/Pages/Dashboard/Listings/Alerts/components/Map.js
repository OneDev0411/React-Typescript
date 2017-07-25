import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import Brand from '../../../../../../controllers/Brand'
import Marker from '../../components/Markers/SimpleMarker'
import { setCssPositionToListingsWithSameBuilding } from '../../../../../../utils/map'

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
  withHandlers({
    onGoogleApiLoaded: ({ selectedAlert }) => ({ map }) => {
      window.currentMap = map

      if (selectedAlert && markersOverlay) {
        drawingOverlay(normalizePoints(selectedAlert.points))
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
    (props, nextProps) =>
      !_.isEqual(props.selectedAlert, nextProps.selectedAlert),
    ({ selectedAlert, mapProps }) => {
      if (!window.google || !selectedAlert || !mapProps.bounds) {
        return {}
      }

      if (markersOverlay) {
        markersOverlay.setMap(null)
      }

      const googleMaps = window.google.maps
      const points = normalizePoints(selectedAlert.points)

      const bounds = new googleMaps.LatLngBounds()
      points.forEach(point => bounds.extend(point))

      window.currentMap.fitBounds(bounds)

      drawingOverlay(points)
    }
  ),
  withPropsOnChange(
    (props, nextProps) => !_.isEqual(props.markers, nextProps.markers),
    ({ markers = [] }) => ({
      markers: setCssPositionToListingsWithSameBuilding(
        markers.map(marker => ({
          lat: marker.lat,
          lng: marker.lng,
          points: [marker]
        }))
      )
    })
  )
)

export default mapHOC(map)

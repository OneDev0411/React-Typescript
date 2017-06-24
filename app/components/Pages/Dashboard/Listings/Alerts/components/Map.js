import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import Marker from '../../../Mls/Partials/Markers/SingleMarker'
import * as actions from '../../../../../../store_actions/listings/map'
import {
  bootstrapURLKeys,
  mapOptions,
  mapInitialState
} from '../../../Mls/Partials/MlsMapOptions'

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
    onGoogleApiLoaded={onGoogleApiLoaded}>
    {markers.map(({ id, ...markerProps }) =>
      <Marker
        data={appData}
        {...markerProps}
        key={`ALERTS_MAP__MARKER_${id}`}
        onMouseEnterHandler={() => onMarkerMouseEnter(id)}
        onMouseLeaveHandler={() => onMarkerMouseLeave(id)}
        markerPopupIsActive={hoveredMarkerId === id}
      />
    )}
  </Map>

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
    onGoogleApiLoaded: () => ({ map }) => {
      window.currentMap = map
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
  withPropsOnChange(['selectedAlert'], ({ selectedAlert, mapProps }) => {
    if (!window.google || !selectedAlert || !mapProps.bounds) {
      return {}
    }

    const googleMaps = window.google.maps

    const bounds = new googleMaps.LatLngBounds()
    selectedAlert.points
      .map(point => ({
        lat: point.latitude,
        lng: point.longitude
      }))
      .forEach(point => bounds.extend(point))

    window.currentMap.fitBounds(bounds)
  })
)

export default mapHOC(map)

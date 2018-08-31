import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import Marker from '../../components/Markers/SimpleMarker'
import * as actions from '../../../../../../store_actions/listings/map'
import { bootstrapURLKeys, mapOptions, mapInitialState } from '../../mapOptions'

const map = ({
  user,
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
  onClickZoomHandler,
  map: { hoveredMarkerId },
  mapProps: { zoom, center }
}) => (
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
    {markers.map(marker => {
      const { id, lat, lng } = marker

      return (
        <Marker
          lat={lat}
          lng={lng}
          user={user}
          data={appData}
          listing={marker}
          key={`MARKER_${id}`}
          onMouseEnterHandler={() => onMarkerMouseEnter(id)}
          onMouseLeaveHandler={() => onMarkerMouseLeave(id)}
          markerPopupIsActive={hoveredMarkerId === id}
        />
      )
    })}
  </Map>
)

const mapHOC = compose(
  defaultProps({
    defaultZoom: 11,
    bootstrapURLKeys,
    options: mapOptions,
    defaultCenter: mapInitialState.center,
    style: {
      position: 'relative',
      height: 'calc(100vh - 72px)'
    }
  }),
  connect(
    ({ user, data, favorites }) => {
      const { map } = favorites

      return {
        map,
        user,
        appData: data,
        mapProps: map.props
      }
    },
    actions
  ),
  // describe events
  withHandlers({
    onGoogleApiLoaded: () => ({ map }) => {
      window.currentMap = map
    },
    onChange: ({ setMapProps }) => mapProps => {
      setMapProps('favorites', mapProps)
    },
    onMarkerMouseLeave: ({ setMapHoveredMarkerId }) => () => {
      setMapHoveredMarkerId('favorites', -1)
    },
    onMarkerMouseEnter: ({ setMapHoveredMarkerId }) => id => {
      setMapHoveredMarkerId('favorites', id)
    }
  }),
  withPropsOnChange(
    (props, nextProps) => props.markers.length !== nextProps.markers.length,
    ({ markers, mapProps }) => {
      if (!window.google || !markers.length || !mapProps.bounds) {
        return {}
      }

      const googleMaps = window.google.maps

      const bounds = new googleMaps.LatLngBounds()

      markers.forEach(point => bounds.extend(point))

      window.currentMap.fitBounds(bounds)
    }
  )
)

export default mapHOC(map)

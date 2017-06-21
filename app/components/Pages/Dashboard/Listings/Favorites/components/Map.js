import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import supercluster from 'points-cluster'
import withState from 'recompose/withState'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import controller from '../../../controller'
// import ZoomController from '../../components/ZoomController'
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
  onMarkerMouseEnter,
  onMarkerMouseLeave,
  onClickZoomHandler,
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
    bootstrapURLKeys={bootstrapURLKeys}>
    {markers.map(({ ...markerProps, numPoints, list, lat, lng, id }) =>
      <Marker
        key={id}
        data={appData}
        {...markerProps}
        onMouseEnterHandler={() => onMarkerMouseEnter(id)}
        onMouseLeaveHandler={() => onMarkerMouseLeave(id)}
        markerPopupIsActive={hoveredMarkerId === id}
      />
    )}
  </Map>

const mapHOC = compose(
  defaultProps({
    defaultZoom: 11,
    bootstrapURLKeys,
    options: mapOptions,
    defaultCenter: mapInitialState.center,
    style: {
      position: 'relative',
      height: 'calc(100vh - 55px)'
    }
  }),
  connect(({ data, favorites }) => {
    const { map } = favorites
    return {
      map,
      appData: data,
      user: data.user,
      mapProps: map.props
    }
  }, actions),
  // describe events
  withHandlers({
    onChange: ({ setMapProps }) => mapProps => {
      setMapProps('FAVORITE', mapProps)
    },
    onClickZoomHandler: ({ updateMapZoom }) => zoomType => {
      updateMapZoom('FAVORITE', zoomType)
    },
    onMarkerMouseLeave: ({ setMapHoveredMarkerId }) => () => {
      setMapHoveredMarkerId('FAVORITE', -1)
    },
    onMarkerMouseEnter: ({ setMapHoveredMarkerId }) => id => {
      setMapHoveredMarkerId('FAVORITE', id)
    }
  })
)

export default mapHOC(map)

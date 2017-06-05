import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import supercluster from 'points-cluster'
import withReducer from 'recompose/withReducer'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import ClusterMarker from '../../Mls/Partials/Markers/ClusterMarker'
import SimpleMarker from '../../Mls/Partials/Markers/SingleMarker'
import { mapOptions, bootstrapURLKeys } from '../../Mls/Partials/MlsMapOptions'
import { mapProps } from '../../../../../reducers/listings/search'
import { SET_MAP_PROPS } from '../../../../../constants/listings/search'

export const searchMap = ({
  style, options,
  bootstrapURLKeys,
  mapProps: { center, zoom },
  onChange
}) => (
  <Map
    style={style}
    options={options}
    center={center}
    zoom={zoom}
    onChange={onChange}
    yesIWantToUseGoogleMapApiInternals
    bootstrapURLKeys={bootstrapURLKeys}
  />
)

export const searchMapHOC = compose(
  defaultProps({
    clusterRadius: 60,
    options: {
      minZoom: 3,
      maxZoom: 15
    },
    style: {
      position: 'relative',
      height: 'calc(100vh - 65px)',
      margin: 0,
      padding: 0,
      flex: 1
    },
    bootstrapURLKeys
  }),
  withReducer(
    'mapProps',
    'setMapProps',
    mapProps,
    mapOptions
  ),
  // describe events
  withHandlers({
    onChange: ({ setMapProps }) => (options) => {
      setMapProps({
        type: SET_MAP_PROPS,
        options
      })
    }
  })
)

export default searchMapHOC(searchMap)
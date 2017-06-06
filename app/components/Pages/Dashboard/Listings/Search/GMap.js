import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import supercluster from 'points-cluster'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import SimpleMarker from '../../Mls/Partials/Markers/SingleMarker'
import ClusterMarker from '../../Mls/Partials/Markers/ClusterMarker'
import { SET_MAP_PROPS } from '../../../../../constants/listings/search'
import { bootstrapURLKeys, mapOptions } from '../../Mls/Partials/MlsMapOptions'
import { getMapProps } from '../../../../../reducers/listings/search'
import * as actions from '../../../../../store_actions/listings/search'

export const searchMap = ({
  style,
  options,
  onChange,
  bootstrapURLKeys,
  mapProps: { center, zoom }
}) => (
  <Map
    zoom={zoom}
    style={style}
    center={center}
    options={options}
    onChange={onChange}
    yesIWantToUseGoogleMapApiInternals
    bootstrapURLKeys={bootstrapURLKeys}
  />
)

export const searchMapHOC = compose(
  defaultProps({
    clusterRadius: 60,
    options: mapOptions,
    style: {
      position: 'relative',
      height: 'calc(100vh - 65px)',
      margin: 0,
      padding: 0,
      flex: 1
    },
    bootstrapURLKeys
  }),
  connect(
    ({ search }) => ({
      mapProps: search.mapProps
    }),
    actions
  ),
  // describe events
  withHandlers({
    onChange: ({ setMapProps }) => (mapProps) => {
      setMapProps(mapProps)
    }
  })
)

export default searchMapHOC(searchMap)

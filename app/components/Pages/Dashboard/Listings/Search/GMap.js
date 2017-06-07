import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import supercluster from 'points-cluster'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import ZoomController from '../components/ZoomController'
import SimpleMarker from '../../Mls/Partials/Markers/SingleMarker'
import ClusterMarker from '../../Mls/Partials/Markers/ClusterMarker'
import * as mapActions from '../../../../../store_actions/listings/map'
import * as searchActions from '../../../../../store_actions/listings/search'
import { bootstrapURLKeys, mapOptions, mapInitialState } from
  '../../Mls/Partials/MlsMapOptions'

const actions = {
  ...mapActions,
  ...searchActions
}

export const searchMap = ({
  style,
  options,
  onChange,
  defaultZoom,
  defaultCenter,
  bootstrapURLKeys,
  onClickZoomHandler,
  mapProps: { zoom, center }
}) => (
  <div>
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
    />
    <ZoomController onClickZoomHandler={onClickZoomHandler} />
  </div>
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
    bootstrapURLKeys,
    defaultZoom: mapInitialState.zoom,
    defaultCenter: mapInitialState.center
  }),
  connect(
    ({ search }) => {
      // console.log('search map connect', search.mapProps)
      return ({
        mapProps: search.mapProps
      })
    },
    actions
  ),
  // describe events
  withHandlers({
    onChange: ({ setMapProps }) => (mapProps) => {
      setMapProps('SEARCH', mapProps)
    },
    onClickZoomHandler: ({ updateMapZoom }) => (zoomType) => {
      updateMapZoom('SEARCH', zoomType)
    }
  })
)

export default searchMapHOC(searchMap)

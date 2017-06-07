import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import supercluster from 'points-cluster'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import controller from '../../controller'
import ZoomController from '../components/ZoomController'
import { getListings } from '../../../../../reducers/listings'
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
  appData,
  options,
  onChange,
  listings,
  defaultZoom,
  defaultCenter,
  bootstrapURLKeys,
  onChildMouseEnter,
  onChildMouseLeave,
  onClickZoomHandler,
  mapProps: {
    zoom,
    center,
    hoveredMarkerId
  }
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
      onChildMouseEnter={onChildMouseEnter}
      onChildMouseLeave={onChildMouseLeave}
    >
      {
        listings.length && listings.map(
          ({ ...markerProps, numPoints, list, lat, lng, id }) => (
            <SimpleMarker
              key={id}
              data={appData}
              {...markerProps}
              onClickHandler={
                controller.listing_viewer.showListingViewer.bind(this)
              }
              markerPopupIsActive={hoveredMarkerId === id}
            />
          )
        )
      }
    </Map>
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
    ({ search, data, user }) => {
      // console.log('search map connect', search.mapProps)
      const { listings } = search
      return ({
        appData: {
          ...data,
          user
        },
        mapProps: search.mapProps,
        listings: getListings(listings),
        isFetching: listings.isFetching
      })
    },
    actions
  ),
  // describe events
  withHandlers({
    onChange: ({ setMapProps, isFetching, fetchListings }) => (mapProps) => {
      setMapProps('SEARCH', mapProps)
      if (!isFetching && mapProps.bounds != null) {
        fetchListings(mapProps)
      }
    },
    onClickZoomHandler: ({ updateMapZoom }) => (zoomType) => {
      updateMapZoom('SEARCH', zoomType)
    },
    onChildMouseLeave: ({ setMapHoveredMarkerId }) => () => {
      setMapHoveredMarkerId('SEARCH', -1)
    },
    onChildMouseEnter: ({ setMapHoveredMarkerId }) => (hoverKey, { id }) => {
      setMapHoveredMarkerId('SEARCH', id)
    }
  })
)

export default searchMapHOC(searchMap)

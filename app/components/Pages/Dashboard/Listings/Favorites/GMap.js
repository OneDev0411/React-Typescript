import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import supercluster from 'points-cluster'
import withState from 'recompose/withState'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import controller from '../../controller'
import ZoomController from '../components/ZoomController'
import Marker from '../../Mls/Partials/Markers/SingleMarker'
import { bootstrapURLKeys, mapOptions, mapInitialState } from '../../Mls/Partials/MlsMapOptions'
import * as mapActions from '../../../../../store_actions/listings/map'

const actions = {
  ...mapActions
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
}) => {
  // console.log('map render favorite', zoom, listings)
  return (
    <div>
      <Map
        zoom={zoom}
        style={style}
        center={center}
        options={options}
        onChange={onChange}
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        bootstrapURLKeys={bootstrapURLKeys}
        onChildMouseEnter={onChildMouseEnter}
        onChildMouseLeave={onChildMouseLeave}
      >
        {
          listings.length && listings.map(
            ({ ...markerProps, numPoints, list, lat, lng, id }) => (
              <Marker
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
}

export const searchMapHOC = compose(
  defaultProps({
    defaultZoom: 11,
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
    defaultCenter: mapInitialState.center
  }),
  connect(
    ({ favorites, user, data }) => {
      // console.log('gmap connect favorites', favorites)
      return ({
        appData: {
          ...data,
          user
        },
        mapProps: favorites.mapProps
      })
    },
    actions
  ),
  // describe events
  withHandlers({
    onChange: ({ setMapProps }) => (mapProps) => {
      setMapProps('FAVORITE', mapProps)
    },
    onClickZoomHandler: ({ updateMapZoom }) => (zoomType) => {
      updateMapZoom('FAVORITE', zoomType)
    },
    onChildMouseLeave: ({ setMapHoveredMarkerId }) => () => {
      setMapHoveredMarkerId('FAVORITE', -1)
    },
    onChildMouseEnter: ({ setMapHoveredMarkerId }) => (hoverKey, { id }) => {
      setMapHoveredMarkerId('FAVORITE', id)
    }
  })
)

export default searchMapHOC(searchMap)

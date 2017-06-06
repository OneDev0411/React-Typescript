import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import supercluster from 'points-cluster'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
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
  bootstrapURLKeys,
  mapProps: {
    zoom = 11,
    center = mapInitialState.center
  }
}) => {
  // console.log('map render favorite', zoom, listings)
  return (
    <Map
      zoom={zoom}
      style={style}
      center={center}
      options={options}
      onChange={onChange}
      yesIWantToUseGoogleMapApiInternals
      bootstrapURLKeys={bootstrapURLKeys}
    >
      {
        listings.length && listings.map(
          ({ ...markerProps, numPoints, list, lat, lng, id }) => (
            <Marker
              key={id}
              data={appData}
              {...markerProps}
            />
          )
        )
      }
    </Map>
  )
}

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
    }
  })
)

export default searchMapHOC(searchMap)

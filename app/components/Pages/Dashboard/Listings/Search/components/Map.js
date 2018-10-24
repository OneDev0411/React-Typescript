import styled from 'styled-components'
import _ from 'lodash'
import cuid from 'cuid'
import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import supercluster from 'points-cluster'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import { batchActions } from 'redux-batched-actions'

import { reset as resetSearchType } from '../../../../../../store_actions/listings/search/set-type'
import { getLocationFromCookies } from '../../../../../../store_actions/listings/map/user-location'
import {
  setCssPositionToListingsWithSameBuilding,
  normalizeListingsForMarkers
} from '../../../../../../utils/map'

import * as mapActions from '../../../../../../store_actions/listings/map'
import setSearchInput from '../../../../../../store_actions/listings/search/set-search-input'
import { setSearchLocation } from '../../../../../../store_actions/listings/search/set-search-location'
import * as drawingActions from '../../../../../../store_actions/listings/map/drawing'
import getListingsByMapBounds from '../../../../../../store_actions/listings/search/get-listings/by-map-bounds'
import { SearchPin } from '../../../../../../views/MLS/SearchPin'

import ZoomController from '../../components/ZoomController'
import SimpleMarker from '../../components/Markers/SimpleMarker'
import ClusterMarker from '../../components/Markers/ClusterMarker'
import NotLoggedInMessage from '../../components/NotLoggedInMessage'

import DrawingButton from './DrawingButton'
import LocationButton from './LocationButton'
import { DrawingRemoveButton } from './DrawingRemoveButton'

import {
  bootstrapURLKeys,
  mapOptions,
  mapInitialState,
  DECLUSTER_ZOOM_LEVEL
} from '../../mapOptions'

const actions = {
  ...mapActions,
  ...drawingActions,
  resetSearchType,
  setSearchInput,
  setSearchLocation,
  getListingsByMapBounds,
  getLocationFromCookies
}

let mapOnChangeDebounce = 0

const map = ({
  user,
  appData,
  options,
  isWidget,
  onChange,
  clusters,
  searchText,
  defaultZoom,
  defaultCenter,
  searchLocation,
  bootstrapURLKeys,
  onGoogleApiLoaded,
  onMarkerMouseEnter,
  onMarkerMouseLeave,
  onClickRemovePolygon,
  onClusterMarkerClick,
  mapProps: { zoom, center },
  map: { hoveredMarkerId, drawing }
}) => (
  <div>
    <Map
      zoom={zoom}
      center={center}
      options={options}
      onChange={onChange}
      margin={[175, 50, 50, 50]}
      defaultZoom={defaultZoom}
      defaultCenter={defaultCenter}
      yesIWantToUseGoogleMapApiInternals
      bootstrapURLKeys={bootstrapURLKeys}
      onGoogleApiLoaded={onGoogleApiLoaded}
      style={{ height: 'calc(100vh - 9em - 1px)' }}
    >
      {clusters.map(({ points, lat, lng }, index) => {
        if (points.length === 1) {
          const { id } = points[0]

          return (
            <SimpleMarker
              lat={lat}
              lng={lng}
              user={user}
              data={appData}
              listing={points[0]}
              isWidget={isWidget}
              key={`SIMPLE_MARKER_${id}`}
              markerPopupIsActive={hoveredMarkerId === id}
              onMouseEnterHandler={() => onMarkerMouseEnter(id)}
              onMouseLeaveHandler={() => onMarkerMouseLeave(id)}
            />
          )
        }

        return (
          <ClusterMarker
            lat={lat}
            lng={lng}
            text={points.length}
            key={`CLUSTER_MARKER_${index}`}
            onClickHandler={() => onClusterMarkerClick(points)}
          />
        )
      })}
      {searchLocation && <SearchPin {...searchLocation} caption={searchText} />}
    </Map>
    <DrawingButton />
    <DrawingRemoveButton
      onClick={onClickRemovePolygon}
      points={drawing.points}
    />
    <ZoomController tabName="search" isTopOfLocation />
    <LocationButton />
    {!isWidget && <NotLoggedInMessage isLoggedIn={user ? true : ''} />}
  </div>
)

const mapHOC = compose(
  defaultProps({
    clusterRadius: 60,
    bootstrapURLKeys,
    options: mapOptions,
    defaultZoom: mapInitialState.zoom,
    defaultCenter: mapInitialState.center,
    clusterOptions: {
      minZoom: 12,
      maxZoom: DECLUSTER_ZOOM_LEVEL - 1
    }
  }),
  connect(
    ({ user, data, search }, { listings }) => ({
      user,
      appData: data,
      map: search.map,
      searchType: search.type,
      mapProps: search.map.props,
      markers: listings.data,
      searchText: search.input,
      searchLocation: search.location
    }),
    actions
  ),
  // describe events
  withHandlers({
    onGoogleApiLoaded: ({ map, getLocationFromCookies }) => ({
      map: googleMap
    }) => {
      googleMap.id = cuid()
      window.currentMap = googleMap

      const { shape, points } = map.drawing

      if (points.length) {
        shape.setMap(googleMap)
      }

      getLocationFromCookies()
    },
    onChange: ({
      map,
      searchText,
      searchType,
      setMapProps,
      setSearchInput,
      setSearchLocation,
      resetSearchType,
      setOffMapAutoMove,
      getListingsByMapBounds
    }) => (gmap = {}) => {
      const { marginBounds } = gmap

      setMapProps('search', gmap)

      if (!map.autoMove && searchText) {
        batchActions([setSearchInput(''), setSearchLocation(null)])
      }

      if (map.autoMove) {
        setOffMapAutoMove()

        // search by our api
        if (searchType === 'by_map_bounds') {
          getListingsByMapBounds(marginBounds)
        }

        if (searchType === 'by_google_suggests') {
          getListingsByMapBounds(marginBounds)
          resetSearchType()
        }

        if (searchType === 'by_filters_areas') {
          resetSearchType()
        }

        return
      }

      if (marginBounds) {
        if (!mapOnChangeDebounce) {
          mapOnChangeDebounce = 1
          getListingsByMapBounds(marginBounds)
        } else {
          clearTimeout(mapOnChangeDebounce)
          mapOnChangeDebounce = setTimeout(() => {
            getListingsByMapBounds(marginBounds)
            clearTimeout(mapOnChangeDebounce)
          }, 300)
        }
      }
    },
    onMarkerMouseLeave: ({ setMapHoveredMarkerId }) => () => {
      setMapHoveredMarkerId('search', -1)
    },
    onMarkerMouseEnter: ({ setMapHoveredMarkerId }) => id => {
      setMapHoveredMarkerId('search', id)
    },
    onClickRemovePolygon: ({
      map,
      removePolygon,
      inactiveDrawing,
      getListingsByMapBounds
    }) => () => {
      removePolygon(map.drawing.shape)
      inactiveDrawing()
      getListingsByMapBounds(map.props.marginBounds)
    },
    onClusterMarkerClick: () => points => {
      const googleMaps = window.google.maps

      const bounds = new googleMaps.LatLngBounds()

      points.forEach(point => styled(bounds)(point))

      window.currentMap.fitBounds(bounds)
    }
  }),
  // precalculate clusters if markers data has changed
  withPropsOnChange(
    (props, nextProps) => !_.isEqual(props.markers, nextProps.markers),
    ({
      markers = [],
      clusterRadius,
      clusterOptions: { minZoom, maxZoom }
    }) => ({
      getCluster: supercluster(normalizeListingsForMarkers(markers), {
        minZoom, // min zoom to generate clusters on
        maxZoom, // max zoom level to cluster the points on
        radius: clusterRadius // cluster radius in pixels
      })
    })
  ),
  // get clusters specific for current bounds and zoom
  withPropsOnChange(
    ['mapProps', 'getCluster'],
    ({ mapProps, getCluster, isFetching }) => {
      let clusters = []

      isFetching = isFetching && mapProps.zoom < DECLUSTER_ZOOM_LEVEL

      if (_.isEmpty(mapProps) || !mapProps.bounds || isFetching) {
        return { clusters }
      }

      clusters = getCluster(mapProps).map(({ wx, wy, points }) => ({
        points,
        lat: wy,
        lng: wx
      }))

      if (mapProps.zoom >= DECLUSTER_ZOOM_LEVEL) {
        clusters = setCssPositionToListingsWithSameBuilding(clusters)
      }

      return { clusters }
    }
  )
)

export default mapHOC(map)

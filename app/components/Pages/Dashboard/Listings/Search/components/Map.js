import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import supercluster from 'points-cluster'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

import {
  setCssPositionToListingsWithSameBuilding,
  normalizeListingsForMarkers,
  getBounds
} from 'utils/map'
import * as mapActions from 'actions/listings/map'
import * as drawingActions from 'actions/listings/map/drawing'
import { reset as resetSearchType } from 'actions/listings/search/set-type'
import getListingsByMapBounds from 'actions/listings/search/get-listings/by-map-bounds'

import SearchPinMarker from 'components/SearchPinMarker'

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
  getListingsByMapBounds
}

let mapOnChangeDebounce = 0

const map = ({
  map,
  user,
  brand,
  isWidget,
  onChange,
  clusters,
  searchText,
  searchLocation,
  onGoogleApiLoaded,
  onClickRemovePolygon,
  fitBoundsByPoints
}) => (
  <div>
    <Map
      options={mapOptions}
      onChange={onChange}
      zoom={map.props.zoom}
      center={map.props.center}
      defaultZoom={mapInitialState.zoom}
      defaultCenter={mapInitialState.center}
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
              barnd={brand}
              listing={points[0]}
              isWidget={isWidget}
              key={`SIMPLE_MARKER_${id}`}
            />
          )
        }

        return (
          <ClusterMarker
            lat={lat}
            lng={lng}
            text={points.length}
            key={`CLUSTER_MARKER_${index}`}
            onClickHandler={() => fitBoundsByPoints(points)}
          />
        )
      })}
      {searchLocation && (
        <SearchPinMarker {...searchLocation} caption={searchText} />
      )}
    </Map>
    <DrawingButton />
    <DrawingRemoveButton
      onClick={onClickRemovePolygon}
      points={map.drawing.points}
    />
    <ZoomController tabName="search" isTopOfLocation />
    <LocationButton />
    {!isWidget && <NotLoggedInMessage isLoggedIn={user ? true : ''} />}
  </div>
)

const mapHOC = compose(
  connect(
    ({ user, brand, search }, { listings }) => ({
      user,
      brand,
      map: search.map,
      searchType: search.type,
      mapProps: search.map.props,
      markers: listings.data,
      searchText: search.input,
      searchLocation: search.location
    }),
    actions
  ),
  withState('isInit', 'setIsInit', false),
  withState('clusters', 'setClusters', []),
  withHandlers({
    fitBoundsByPoints: () => points => {
      const googleMaps = window.google.maps

      const bounds = new googleMaps.LatLngBounds()

      points.forEach(p => bounds.extend(p))

      window.currentMap.fitBounds(bounds)
    }
  }),
  withHandlers({
    generateClusters: ({ setClusters }) => (markers = [], mapProps) => {
      const getCluster = supercluster(markers, {
        // min zoom to generate clusters on
        minZoom: 12,
        // max zoom level to cluster the points on
        maxZoom: DECLUSTER_ZOOM_LEVEL - 1,
        radius: 60 // cluster radius in pixels
      })

      let clusters = getCluster(mapProps).map(({ wx, wy, points }) => ({
        points,
        lat: wy,
        lng: wx
      }))

      if (mapProps.zoom >= DECLUSTER_ZOOM_LEVEL) {
        clusters = setCssPositionToListingsWithSameBuilding(clusters)
      }

      setClusters(clusters)
    }
  }),
  withHandlers({
    onChange: ({
      map,
      isInit,
      searchType,
      setMapProps,
      resetSearchType,
      setOffMapAutoMove,
      getListingsByMapBounds
    }) => (gmap = {}) => {
      if (!isInit) {
        return
      }

      const { bounds } = gmap

      setMapProps('search', gmap)

      if (map.autoMove) {
        setOffMapAutoMove()

        // search by our api
        if (searchType === 'by_map_bounds') {
          getListingsByMapBounds(bounds)
        }

        if (searchType === 'by_google_suggests') {
          getListingsByMapBounds(bounds)
          resetSearchType()
        }

        if (searchType === 'by_filters_areas') {
          resetSearchType()
        }

        return
      }

      if (!mapOnChangeDebounce) {
        mapOnChangeDebounce = 1
        getListingsByMapBounds(bounds)
      } else {
        clearTimeout(mapOnChangeDebounce)
        mapOnChangeDebounce = setTimeout(() => {
          getListingsByMapBounds(bounds)
          clearTimeout(mapOnChangeDebounce)
        }, 300)
      }
    }
  }),
  withHandlers({
    getMapProps: () => googleMapObj => ({
      bounds: getBounds(googleMapObj.getBounds(), true),
      center: googleMapObj.getCenter().toJSON(),
      zoom: googleMapObj.getZoom()
    })
  }),
  withHandlers({
    onGoogleApiLoaded: ({
      markers,
      setIsInit,
      map,
      onChange,
      getMapProps,
      fitBoundsByPoints
    }) => ({ map: googleMap }) => {
      googleMap.id = 'SEARCH_MAP'
      window.currentMap = googleMap

      const { shape, points: drawingPoints } = map.drawing

      if (drawingPoints.length > 0) {
        shape.setMap(googleMap)
        fitBoundsByPoints(
          drawingPoints.map(({ latitude: lat, longitude: lng }) => ({
            lat,
            lng
          }))
        )
      }

      if (markers.length > 0 && !map.autoMove) {
        if (drawingPoints.length === 0 && Object.keys(map.props).length === 0) {
          const normalizedMarkers = normalizeListingsForMarkers(markers)

          fitBoundsByPoints(normalizedMarkers)
        }

        const timeoutID = setTimeout(() => {
          setIsInit(true)
          clearTimeout(timeoutID)
        }, 1000)
      } else {
        setIsInit(true)
        onChange(getMapProps(googleMap))
      }
    },
    onClickRemovePolygon: ({
      map,
      removePolygon,
      inactiveDrawing,
      getListingsByMapBounds
    }) => () => {
      removePolygon(map.drawing.shape)
      inactiveDrawing()
      getListingsByMapBounds(map.props.marginBounds || map.props.bounds)
    }
  }),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.mapProps, nextProps.mapProps) ||
      !isEqual(props.markers, nextProps.markers),
    ({ mapProps, markers, generateClusters, isFetching }) => {
      if (!isFetching && !isEmpty(mapProps) && mapProps.bounds) {
        generateClusters(normalizeListingsForMarkers(markers), mapProps)
      }
    }
  )
)

export default mapHOC(map)

import React from 'react'

import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

import * as mapActions from 'actions/listings/map'
import * as drawingActions from 'actions/listings/map/drawing'
import getListingsByMapBounds from 'actions/listings/search/get-listings/by-map-bounds'
import { reset as resetSearchType } from 'actions/listings/search/set-type'
import SearchPinMarker from 'components/SearchPinMarker'
import { normalizeListingsForMarkers, getBounds } from 'utils/map'

import SimpleMarker from '../../components/Markers/SimpleMarker'
import NotLoggedInMessage from '../../components/NotLoggedInMessage'
import ZoomController from '../../components/ZoomController'
import { bootstrapURLKeys, mapOptions, mapInitialState } from '../../mapOptions'

import DrawingButton from './DrawingButton'
import { DrawingRemoveButton } from './DrawingRemoveButton'
import LocationButton from './LocationButton'

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
  markers,
  searchText,
  searchLocation,
  onGoogleApiLoaded,
  onClickRemovePolygon,
  lastBrowsingLocation
}) => (
  <>
    <Map
      options={mapOptions}
      onChange={onChange}
      zoom={map.props.zoom}
      center={map.props.center}
      defaultZoom={lastBrowsingLocation?.zoom || mapInitialState.zoom}
      defaultCenter={lastBrowsingLocation?.center || mapInitialState.center}
      yesIWantToUseGoogleMapApiInternals
      bootstrapURLKeys={bootstrapURLKeys}
      onGoogleApiLoaded={onGoogleApiLoaded}
      style={{ height: '100%', width: '100%' }}
    >
      {markers.map(marker => {
        return (
          <SimpleMarker
            lat={marker.location.latitude}
            lng={marker.location.longitude}
            user={user}
            barnd={brand}
            listing={marker}
            isWidget={isWidget}
            key={`SIMPLE_MARKER_${marker.id}`}
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
  </>
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
  withHandlers({
    fitBoundsByPoints: () => points => {
      const googleMaps = window.google.maps

      const bounds = new googleMaps.LatLngBounds()

      points.forEach(p => bounds.extend(p))

      window.currentMap.fitBounds(bounds)
    }
  }),
  withHandlers({
    onChange:
      ({
        map,
        isInit,
        searchType,
        setMapProps,
        resetSearchType,
        setOffMapAutoMove,
        getListingsByMapBounds,
        updateUserLocation
      }) =>
      (gmap = {}) => {
        if (map.props.center && map.props.zoom) {
          updateUserLocation({ center: map.props.center, zoom: map.props.zoom })
        }

        if (!isInit) {
          return
        }

        const { bounds } = gmap

        setMapProps('search', gmap)

        if (map.autoMove) {
          setOffMapAutoMove()

          // search by our api
          if (searchType === 'by_map_bounds') {
            console.log('searchType === by_map_bounds')
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
    onGoogleApiLoaded:
      ({ markers, setIsInit, map, onChange, getMapProps, fitBoundsByPoints }) =>
      ({ map: googleMap }) => {
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
          if (
            drawingPoints.length === 0 &&
            Object.keys(map.props).length === 0
          ) {
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
    onClickRemovePolygon:
      ({ map, removePolygon, inactiveDrawing, getListingsByMapBounds }) =>
      () => {
        removePolygon(map.drawing.shape)
        inactiveDrawing()
        getListingsByMapBounds(map.props.marginBounds || map.props.bounds)
      }
  })
)

export default mapHOC(map)

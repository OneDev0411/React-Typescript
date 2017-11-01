import _ from 'lodash'
import cuid from 'cuid'
import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import supercluster from 'points-cluster'
import shallowEqual from 'recompose/shallowEqual'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import SimpleMarker from '../../components/Markers/SimpleMarker'
import ClusterMarker from '../../components/Markers/ClusterMarker'
import NotLoggedInMessage from '../../components/NotLoggedInMessage'
import DrawingRemoveButton from '../../components/DrawingRemoveButton'

import {
  setCssPositionToListingsWithSameBuilding,
  normalizeListingsForMarkers
} from '../../../../../../utils/map'

import * as mapActions from '../../../../../../store_actions/listings/map'
import * as drawingActions from '../../../../../../store_actions/listings/map/drawing'
import getListingsByMapBounds from '../../../../../../store_actions/listings/search/get-listings/by-map-bounds'

import {
  bootstrapURLKeys,
  mapOptions,
  mapInitialState,
  DECLUSTER_ZOOM_LEVEL
} from '../../mapOptions'

const actions = {
  ...mapActions,
  ...drawingActions,
  getListingsByMapBounds
}

const map = ({
  style,
  user,
  appData,
  options,
  isWidget,
  onChange,
  clusters,
  defaultZoom,
  defaultCenter,
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
      style={style}
      center={center}
      options={options}
      onChange={onChange}
      defaultZoom={defaultZoom}
      defaultCenter={defaultCenter}
      yesIWantToUseGoogleMapApiInternals
      bootstrapURLKeys={bootstrapURLKeys}
      onGoogleApiLoaded={onGoogleApiLoaded}
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
    </Map>
    {!isWidget && <NotLoggedInMessage isLoggedIn={user ? true : ''} />}
    <DrawingRemoveButton
      onClick={onClickRemovePolygon}
      points={drawing.points}
    />
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
    ({ user, data }, { listings, isWidget }) => ({
      user,
      appData: data,
      markers: listings.data,
      style: {
        position: 'relative',
        height: !isWidget ? 'calc(100vh - 56px)' : '100vh'
      }
    }),
    actions
  ),
  // describe events
  withHandlers({
    onGoogleApiLoaded: ({ map }) => ({ map: googleMap }) => {
      googleMap.id = cuid()
      window.currentMap = googleMap

      const { shape, points } = map.drawing
      if (points.length) {
        shape.setMap(googleMap)
      }
    },
    onChange: ({ setOffMapAutoMove, setMapProps, map }) => gmap => {
      if (map.autoMove) {
        setOffMapAutoMove()
      }

      setMapProps('SEARCH', gmap)
    },
    onMarkerMouseLeave: ({ setMapHoveredMarkerId }) => () => {
      setMapHoveredMarkerId('SEARCH', -1)
    },
    onMarkerMouseEnter: ({ setMapHoveredMarkerId }) => id => {
      setMapHoveredMarkerId('SEARCH', id)
    },
    onClickRemovePolygon: ({
      map,
      removePolygon,
      inactiveDrawing,
      getListingsByMapBounds
    }) => () => {
      removePolygon(map.drawing.shape)
      inactiveDrawing()
      getListingsByMapBounds(map.props.bounds)
    },
    onClusterMarkerClick: () => points => {
      const googleMaps = window.google.maps

      const bounds = new googleMaps.LatLngBounds()
      points.forEach(point => bounds.extend(point))

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

      clusters = getCluster(mapProps).map(({ wx, wy, numPoints, points }) => ({
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

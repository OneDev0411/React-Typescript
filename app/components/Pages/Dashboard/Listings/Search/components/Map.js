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

import { setCssPositionToListingsWithSameBuilding } from '../../../../../../utils/map'

import { getListings } from '../../../../../../reducers/listings'
import * as mapActions from '../../../../../../store_actions/listings/map'
import * as drawingActions from '../../../../../../store_actions/listings/map/drawing'

import { bootstrapURLKeys, mapOptions, mapInitialState } from '../../mapOptions'

const normalizeMarkers = markers =>
  markers.map(marker => ({
    ...marker,
    lat: marker.location.latitude,
    lng: marker.location.longitude
  }))

const actions = {
  ...mapActions,
  ...drawingActions
}

const DECLUSTER_ZOOM_LEVEL = 16

const map = ({
  style,
  appData,
  options,
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
}) =>
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
              data={appData}
              listing={points[0]}
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
    <NotLoggedInMessage isLoggedIn={appData.user ? true : ''} />
    <DrawingRemoveButton
      onClick={onClickRemovePolygon}
      points={drawing.points}
    />
  </div>

const mapHOC = compose(
  defaultProps({
    clusterRadius: 60,
    bootstrapURLKeys,
    options: mapOptions,
    defaultZoom: mapInitialState.zoom,
    defaultCenter: mapInitialState.center,
    style: {
      position: 'relative',
      height: 'calc(100vh - 56px)'
    },
    clusterOptions: {
      minZoom: 12,
      maxZoom: DECLUSTER_ZOOM_LEVEL - 1
    }
  }),
  connect(
    ({ data }, { listings }) => ({
      appData: data,
      markers: listings.data
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
    onClickRemovePolygon: ({ removePolygon, map }) => () => {
      removePolygon(map.drawing.shape)
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
      getCluster: supercluster(normalizeMarkers(markers), {
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

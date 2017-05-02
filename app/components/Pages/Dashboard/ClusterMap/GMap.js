import React from 'react'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import GoogleMapReact from 'google-map-react'
import ClusterMarker from './Markers/ClusterMarker'
import SimpleMarker from './Markers/SimpleMarker'
import supercluster from 'points-cluster'
import config from '../../../../../config/public'

const TOTAL_COUNT = 200

const susolvkaCoords = { lat: 60.814305, lng: 47.051773 }

const markersData = [...Array(TOTAL_COUNT)].fill(0) // fill(0) for loose mode
  .map((__, index) => ({
    id: index,
    lat: susolvkaCoords.lat +
      0.01 * index *
      Math.sin(30 * Math.PI * index / 180) *
      Math.cos(50 * Math.PI * index / 180) + Math.sin(5 * index / 180),
    lng: susolvkaCoords.lng +
      0.01 * index *
      Math.cos(70 + 23 * Math.PI * index / 180) *
      Math.cos(50 * Math.PI * index / 180) + Math.sin(5 * index / 180)
  }))

export const gMap = ({
  bootstrapURLKeys,
  style, hoverDistance, options,
  mapProps: { center, zoom },
  onChange, onChildMouseEnter, onChildMouseLeave,
  clusters
}) => (
  <GoogleMapReact
    bootstrapURLKeys={bootstrapURLKeys}
    style={style}
    options={options}
    hoverDistance={hoverDistance}
    center={center}
    zoom={zoom}
    onChange={onChange}
    onChildMouseEnter={onChildMouseEnter}
    onChildMouseLeave={onChildMouseLeave}
  >
    {
      clusters
        .map(({ ...markerProps, id, numPoints }) => (
          numPoints === 1
            ? <SimpleMarker key={id} {...markerProps} />
            : <ClusterMarker key={id} {...markerProps} />
        ))
    }
  </GoogleMapReact>
)

export const gMapHOC = compose(
  defaultProps({
    bootstrapURLKeys: {
      key: config.google.api_key,
      libraries: ['drawing', 'places'].join(',')
    },
    clusterRadius: 60,
    hoverDistance: 30,
    options: {
      minZoom: 3,
      maxZoom: 15
    },
    style: {
      position: 'relative',
      margin: 0,
      padding: 0,
      flex: 1
    }
  }),
  // withState so you could change markers if you want
  withState(
    'markers',
    'setMarkers',
    markersData
  ),
  withState(
    'hoveredMarkerId',
    'setHoveredMarkerId',
    -1
  ),
  withState(
    'mapProps',
    'setMapProps',
    {
      center: susolvkaCoords,
      zoom: 10
    }
  ),
  // describe events
  withHandlers({
    onChange: ({ setMapProps }) => ({ center, zoom, bounds }) => {
      setMapProps({ center, zoom, bounds })
    },

    onChildMouseEnter: ({ setHoveredMarkerId }) => (hoverKey, { id }) => {
      setHoveredMarkerId(id)
    },

    onChildMouseLeave: ({ setHoveredMarkerId }) => (/* hoverKey, childProps */) => {
      setHoveredMarkerId(-1)
    }
  }),
  // precalculate clusters if markers data has changed
  withPropsOnChange(
    ['markers'],
    ({ markers = [], clusterRadius, options: { minZoom, maxZoom } }) => ({
      getCluster: supercluster(
        markers,
        {
          minZoom, // min zoom to generate clusters on
          maxZoom, // max zoom level to cluster the points on
          radius: clusterRadius // cluster radius in pixels
        }
      )
    })
  ),
  // get clusters specific for current bounds and zoom
  withPropsOnChange(
    ['mapProps', 'getCluster'],
    ({ mapProps, getCluster }) => ({
      clusters: mapProps.bounds
        ? getCluster(mapProps)
          .map(({ wx, wy, numPoints, points }) => ({
            lat: wy,
            lng: wx,
            text: numPoints,
            numPoints,
            id: `${numPoints}_${points[0].id}`
          }))
        : []
    })
  ),
  // set hovered
  withPropsOnChange(
    ['clusters', 'hoveredMarkerId'],
    ({ clusters, hoveredMarkerId }) => ({
      clusters: clusters
        .map(({ ...cluster, id }) => ({
          ...cluster,
          hovered: id === hoveredMarkerId
        }))
    })
  ),
)

export default gMapHOC(gMap)

import React from 'react'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import GoogleMapReact from 'google-map-react'
import ClusterMarker from './Markers/ClusterMarker'
import SimpleMarker from './Markers/SimpleMarker'
import supercluster from 'points-cluster'
import config from '../../../../../config/public'
import { queryOptions, mapOptions, googleOptions } from './options'
import ConciergeDispatcher from '../../../../dispatcher/ConciergeDispatcher'

const { center } = mapOptions

async function getMarkers(user) {
  const action = {
    user,
    body: queryOptions,
    type: 'GET_LISTING'
  }
  const listing =
    await ConciergeDispatcher.dispatchSync(action)

  return listing.map(list => ({
    id: list.id,
    lat: list.location.latitude,
    lng: list.location.longitude,
    ...list
  }))
}

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
      ...googleOptions
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
    []
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
      center,
      zoom: 13
    }
  ),
  lifecycle({
    componentDidMount() {
      getMarkers(this.props.user)
        .then((markers) => {
          this.setState({
            markers
          })
        })
    }
  }),
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
            numPoints,
            text: numPoints === 1
              ? `${Math.round(points[0].price / 1000)}k`
              : numPoints,
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

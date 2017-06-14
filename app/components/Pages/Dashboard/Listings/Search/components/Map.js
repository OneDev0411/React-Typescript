import _ from 'lodash'
import React from 'react'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import supercluster from 'points-cluster'
import defaultProps from 'recompose/defaultProps'
import withHandlers from 'recompose/withHandlers'
import { fitBounds } from 'google-map-react/utils'
import withPropsOnChange from 'recompose/withPropsOnChange'
import extendedBounds from '../../../../../../utils/extendedBounds'

import controller from '../../../controller'
import ZoomController from '../../components/ZoomController'
import { getListings } from '../../../../../../reducers/listings'
import SimpleMarker from '../../../Mls/Partials/Markers/SingleMarker'
import ClusterMarker from '../../../Mls/Partials/Markers/ClusterMarker'
import * as actions from '../../../../../../store_actions/listings/map'
import { setPositionToPointsWithSameCoordinate } from
  '../../../Mls/Partials/MlsMap'
import { bootstrapURLKeys, mapOptions, mapInitialState } from
  '../../../Mls/Partials/MlsMapOptions'

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
  onClickZoomHandler,
  onClusterMarkerClick,
  mapProps: {
    zoom,
    center
  },
  map: { hoveredMarkerId }
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
      {
        clusters.map(
          ({ ...markerProps, numPoints, list, lat, lng, id }) =>
            (numPoints === 1
              ? <SimpleMarker
                key={id}
                data={appData}
                {...markerProps}
                onMouseEnterHandler={() => onMarkerMouseEnter(id)}
                onMouseLeaveHandler={() => onMarkerMouseLeave(id)}
                markerPopupIsActive={hoveredMarkerId === id}
              />
              : <ClusterMarker
                key={id}
                {...markerProps}
                onClickHandler={() => onClusterMarkerClick({ lat, lng }, list)}
              />
            )
        )
      }
    </Map>
    <ZoomController onClickZoomHandler={onClickZoomHandler} />
  </div>
)

const mapHOC = compose(
  defaultProps({
    clusterRadius: 60,
    bootstrapURLKeys,
    options: mapOptions,
    defaultZoom: mapInitialState.zoom,
    defaultCenter: mapInitialState.center,
    style: {
      position: 'relative',
      height: 'calc(100vh - 55px)'
    },
    clusterOptions: {
      minZoom: 12,
      maxZoom: DECLUSTER_ZOOM_LEVEL - 1
    }
  }),
  connect(
    ({ data }) => ({
      appData: { ...data }
    }),
    actions
  ),
  // describe events
  withHandlers({
    onGoogleApiLoaded: () => ({ map }) => {
      window.currentMap = map
    },
    // eslint-disable-next-line
    onChange: ({ setOffMapAutoMove, setMapProps, map }) => {
      return (gmap) => {
        if (map.autoMove) {
          setOffMapAutoMove()
        }

        setMapProps('SEARCH', gmap)
      }
    },
    onClickZoomHandler: ({ updateMapZoom }) => (zoomType) => {
      updateMapZoom('SEARCH', zoomType)
    },
    onMarkerMouseLeave: ({ setMapHoveredMarkerId }) => () => {
      setMapHoveredMarkerId('SEARCH', -1)
    },
    onMarkerMouseEnter: ({ setMapHoveredMarkerId }) => (id) => {
      setMapHoveredMarkerId('SEARCH', id)
    },
    // eslint-disable-next-line
    onClusterMarkerClick: ({ setMapProps, mapProps }) => {
      return (center, points) => { // esl
        const extendedMapProps = extendedBounds(points, mapProps)

        if (!extendedMapProps) {
          setMapProps('SEARCH', {
            ...mapProps,
            center,
            zoom: DECLUSTER_ZOOM_LEVEL + 1
          })
          return
        }

        setMapProps('SEARCH', extendedMapProps)
      }
    }
  }),
  // precalculate clusters if markers data has changed
  withPropsOnChange(
    ['markers'], ({
      markers = [],
      clusterRadius,
      clusterOptions: { minZoom, maxZoom }
    }) => ({
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
    ({ mapProps, getCluster, isFetching }) => {
      let clusters = []

      isFetching = isFetching && mapProps.zoom < DECLUSTER_ZOOM_LEVEL
      if (_.isEmpty(mapProps) || !mapProps.bounds || isFetching) {
        return { clusters }
      }

      clusters = getCluster(mapProps)
        .map(({ wx, wy, numPoints, points }) => ({
          lat: wy,
          lng: wx,
          numPoints,
          id: `${numPoints}_${points[0].id}`,
          text: numPoints !== 1 ? numPoints : '',
          list: numPoints === 1 ? points[0] : points
        }))

      if (mapProps.zoom >= DECLUSTER_ZOOM_LEVEL) {
        clusters = setPositionToPointsWithSameCoordinate(clusters)
      }

      return { clusters }
    }
  ),
)

export default mapHOC(map)

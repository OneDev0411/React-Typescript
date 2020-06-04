import React from 'react'
import _ from 'underscore'
import Map from 'google-map-react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import { primary } from 'views/utils/colors'

import Brand from '../../../../../../controllers/Brand'
import Marker from '../../components/Markers/SimpleMarker'
import {
  setCssPositionToListingsWithSameBuilding,
  generatePointsFromBounds
} from '../../../../../../utils/map'
import { getBounds } from '../../../../../../utils/extendedBounds'
import * as actions from '../../../../../../store_actions/listings/map'
import logUserActivity from '../../../../../../models/user/post-new-activity'
import { setActivityLog } from '../../../../../../store_actions/listings/alerts/set-alert-activity-log'

import { bootstrapURLKeys, mapOptions, mapInitialState } from '../../mapOptions'

const map = ({
  user,
  style,
  markers,
  options,
  onChange,
  defaultZoom,
  defaultCenter,
  bootstrapURLKeys,
  onGoogleApiLoaded,
  mapProps: { zoom, center }
}) => (
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
    {markers.map(({ points, lat, lng }) => {
      const { id } = points[0]

      return (
        <Marker
          lat={lat}
          lng={lng}
          user={user}
          listing={points[0]}
          key={`MARKER_${id}`}
        />
      )
    })}
  </Map>
)

let markersOverlay = null
const overlayColor = Brand.color('primary', primary)

const normalizePoints = points =>
  points.map(point => ({
    lat: point.latitude,
    lng: point.longitude
  }))

const drawingOverlay = points => {
  markersOverlay = new window.google.maps.Polygon({
    paths: points,
    zIndex: 1,
    strokeWeight: 5,
    fillOpacity: 0.35,
    fillColor: overlayColor,
    strokeColor: overlayColor
  })

  markersOverlay.setMap(window.currentMap)
}

const mapHOC = compose(
  defaultProps({
    defaultZoom: 13,
    bootstrapURLKeys,
    options: mapOptions,
    defaultCenter: mapInitialState.center
  }),
  connect(
    ({ user, brand, alerts }) => {
      const { map, loggedAlert } = alerts

      return {
        map,
        brand,
        user,
        loggedAlert,
        mapProps: map.props
      }
    },
    { setActivityLog, ...actions }
  ),
  withState('isLoggedActivity', 'setIsLoggedActivity', null),
  withHandlers({
    onGoogleApiLoaded: () => ({ map }) => {
      window.currentMap = map

      if (markersOverlay) {
        markersOverlay.setMap(map)
      }
    },
    onChange: ({ setMapProps }) => mapProps => {
      setMapProps('alerts', mapProps)
    }
  }),
  withPropsOnChange(
    (props, nextProps) => !_.isEqual(props.markers, nextProps.markers),
    ({ markers = [], mapProps, loggedAlert, savedSearch, setActivityLog }) => {
      markers = setCssPositionToListingsWithSameBuilding(
        markers.map(marker => ({
          lat: marker.lat,
          lng: marker.lng,
          points: [marker]
        }))
      )

      if (savedSearch && savedSearch.id && savedSearch.id !== loggedAlert) {
        logUserActivity({
          object: savedSearch.id,
          object_class: 'alert',
          action: 'UserViewedAlert'
        })
        setActivityLog(savedSearch.id)
      }

      if (markersOverlay && markers.length === 0) {
        markersOverlay.setMap(null)
        markersOverlay = null

        return { markers }
      }

      if (window.google && mapProps.bounds && markers.length > 0) {
        if (markersOverlay) {
          markersOverlay.setMap(null)
          markersOverlay = null
        }

        let points
        const googleMaps = window.google.maps

        if (savedSearch.points) {
          points = normalizePoints(savedSearch.points)
          drawingOverlay(points)
        } else {
          const markersBounds = getBounds(markers)

          points = normalizePoints(generatePointsFromBounds(markersBounds))
        }

        const bounds = new googleMaps.LatLngBounds()

        points.forEach(point => bounds.extend(point))

        window.currentMap.fitBounds(bounds)
      }

      return { markers }
    }
  )
)

export default mapHOC(map)

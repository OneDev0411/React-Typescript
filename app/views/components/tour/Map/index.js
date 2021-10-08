import React from 'react'

import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'

import config from '../../../../../config/public'
import { loadJS } from '../../../../utils/load-js'

import { LocateButton } from './locateButton'
import { Container, MapContainer } from './styled'

const DEFAULT_OPTIONS = {
  zoom: 15,
  center: {
    lat: 32.7767,
    lng: -96.797
  },
  zoomControl: true,
  disableDefaultUI: true
}

const propTypes = {
  id: PropTypes.string.isRequired,
  listings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  defaultOptions: PropTypes.shape(),
  showDirection: PropTypes.bool
}

const defaultProps = {
  defaultOptions: {},
  showDirection: true
}

export class Map extends React.Component {
  state = {
    hasMarker: false,
    isCalculating: false
  }

  componentDidMount() {
    window.initTourDrawerMap = this.initMap

    if (!window.google) {
      // TODO: use loadMapLibraries form `app/utils/google-map-api/index.ts` to load google map libraries
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${config.google.api_key}&callback=initTourDrawerMap`,
        'google-map-script'
      )
    } else {
      this.initMap()
    }
  }

  componentDidUpdate(prevProps) {
    const getId = ({ id }) => id
    const prevListings = prevProps.listings.map(getId)
    const currentListings = this.props.listings.map(getId)

    if (!isEqual(prevListings, currentListings)) {
      this.calculateAndDisplayRoute()
    }
  }

  initMap = () => {
    const { listings } = this.props
    const listingsLength = listings.length

    this.map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      {
        ...DEFAULT_OPTIONS,
        ...this.props.defaultOptions
      }
    )

    if (listingsLength === 0) {
      return
    }

    if (listingsLength === 1) {
      this.setMarker(this.getLocations()[0].location)
    }

    if (listingsLength > 1) {
      this.setDirectionService()
      this.calculateAndDisplayRoute()
    }
  }

  getLatLng = listing =>
    `${listing.location.latitude},${listing.location.longitude}`

  getLocations = () => {
    let locations = []

    this.props.listings.forEach(l => {
      if (l.location) {
        locations.push({ location: l.location })
      } else if (l.property.address.location) {
        locations.push({ location: l.property.address.location })
      }
    })

    return locations
  }

  setDirectionService = () => {
    this.directionsService = new window.google.maps.DirectionsService()
    this.directionsDisplay = new window.google.maps.DirectionsRenderer()
    this.directionsDisplay.setMap(this.map)
  }

  calculateAndDisplayRoute = () => {
    const locations = this.getLocations()

    if (locations.length === 0) {
      this.marker && this.marker.setMap(null)

      return
    }

    if (!this.directionsService) {
      this.setDirectionService()
    }

    if (locations.length === 1) {
      this.directionsDisplay.setDirections({ routes: [] })

      return this.setMarker(locations[0].location)
    }

    if (this.state.hasMarker) {
      this.marker.setMap(null)
    }

    this.setState({ isCalculating: true, hasMarker: false })

    this.directionsService.route(
      {
        origin: this.getLatLng(locations[0]),
        destination: this.getLatLng(locations[locations.length - 1]),
        waypoints:
          locations.length > 2
            ? locations
                .slice(1, locations.length - 1)
                .map(l => ({ location: this.getLatLng(l), stopover: true }))
            : [],
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
      },
      (response, status) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(response)
          this.setState({ isCalculating: false })
        } else {
          console.log(`Directions request failed due to ${status}`)
          this.setState({ isCalculating: false })
        }
      }
    )
  }

  setMarker = location => {
    this.marker = new window.google.maps.Marker({
      label: this.props.showDirection
        ? {
            text: 'A',
            color: '#fff',
            fontSize: '18px'
          }
        : null,
      position: new window.google.maps.LatLng(
        location.latitude,
        location.longitude
      )
    })

    this.marker.setMap(this.map)
    this.map.setCenter(
      new window.google.maps.LatLng(location.latitude, location.longitude)
    )

    this.setState({ hasMarker: true })
  }

  onGetPosition = (lat, lng) => {
    this.map.setCenter(new window.google.maps.LatLng(lat, lng))
  }

  render() {
    return (
      <Container>
        <LocateButton onGetPosition={this.onGetPosition} />
        <MapContainer
          id={this.props.id}
          isCalculating={this.state.isCalculating}
        />
      </Container>
    )
  }
}

Map.propTypes = propTypes
Map.defaultProps = defaultProps

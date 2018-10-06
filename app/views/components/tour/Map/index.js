import React from 'react'
import PropTypes from 'prop-types'

import config from '../../../../../config/public'
import { loadJS } from '../../../../utils/load-js'

import { Container } from './styled'

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
  defaultOptions: PropTypes.shape()
}

const defaultProps = {
  defaultOptions: {}
}

export class Map extends React.Component {
  state = {
    hasMarker: false,
    isCalculating: false
  }

  componentDidMount() {
    window.initTourDrawerMap = this.initMap

    if (!window.google) {
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${
          config.google.api_key
        }&callback=initTourDrawerMap`
      )
    } else {
      this.initMap()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.listings.length !== prevProps.listings.length) {
      this.calculateAndDisplayRoute()
    }
  }

  initMap = () => {
    this.map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      {
        ...DEFAULT_OPTIONS,
        ...this.props.defaultOptions
      }
    )

    if (this.props.listings.length === 1) {
      this.setMarker(this.getLocations()[0].location)
    } else {
      this.directionsService = new window.google.maps.DirectionsService()
      this.directionsDisplay = new window.google.maps.DirectionsRenderer()
      this.directionsDisplay.setMap(this.map)
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

  calculateAndDisplayRoute = () => {
    const locations = this.getLocations()

    if (locations.length === 0) {
      return this.marker.setMap(null)
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
      label: {
        text: 'A',
        color: '#fff',
        fontSize: '18px'
      },
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

  render() {
    return (
      <Container id={this.props.id} isCalculating={this.state.isCalculating} />
    )
  }
}

Map.propTypes = propTypes
Map.defaultProps = defaultProps

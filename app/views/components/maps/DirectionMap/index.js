import React from 'react'
import PropTypes from 'prop-types'

import config from '../../../../../config/public'
import { loadJS } from '../../../../utils/load-js'

import { Container } from '../styled'
import { DEFAULT_OPTIONS } from '../helpers/default-options'

const propTypes = {
  id: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  options: PropTypes.shape()
}

const defaultProps = {
  options: {}
}

export class DirectionMap extends React.Component {
  state = {
    hasMarker: false,
    isCalculating: false
  }

  componentDidMount() {
    const { id } = this.props

    window[id] = this.initMap

    if (!window.google) {
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${
          config.google.api_key
        }&callback=${id}`
      )
    } else {
      this.initMap()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.locations.length !== prevProps.locations.length) {
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
        ...this.props.options
      }
    )

    if (listingsLength === 0) {
      return
    }

    if (listingsLength === 1) {
      this.setMarker(this.props.locations[0])
    }

    if (listingsLength > 1) {
      this.setDirectionService()
      this.calculateAndDisplayRoute()
    }
  }

  setDirectionService = () => {
    this.directionsService = new window.google.maps.DirectionsService()
    this.directionsDisplay = new window.google.maps.DirectionsRenderer()
    this.directionsDisplay.setMap(this.map)
  }

  getLatLng = location =>
    new window.google.maps.LatLng(location.latitude, location.longitude)

  calculateAndDisplayRoute = () => {
    const { locations } = this.props

    if (locations.length === 0) {
      return this.marker.setMap(null)
    }

    if (!this.directionsService) {
      this.setDirectionService()
    }

    if (locations.length === 1) {
      this.directionsDisplay.setDirections({ routes: [] })

      return this.setMarker(locations[0])
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
    const position = this.getLatLng(location)

    this.marker = new window.google.maps.Marker({
      label: this.props.showDirection
        ? {
            text: 'A',
            color: '#fff',
            fontSize: '18px'
          }
        : null,
      position
    })

    this.marker.setMap(this.map)
    this.map.setCenter(position)

    this.setState({ hasMarker: true })
  }

  render() {
    return (
      <Container id={this.props.id} isCalculating={this.state.isCalculating} />
    )
  }
}

DirectionMap.propTypes = propTypes
DirectionMap.defaultProps = defaultProps

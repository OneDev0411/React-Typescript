import React from 'react'

import { loadJS } from '../../../../../../../utils/load-js'
import config from '../../../../../../../../config/public/development'

import { Container } from './styled'

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
    if (this.props.locations.length !== prevProps.locations.length) {
      this.calculateAndDisplayRoute()
    }
  }

  initMap = () => {
    this.directionsService = new window.google.maps.DirectionsService()
    this.directionsDisplay = new window.google.maps.DirectionsRenderer()

    this.map = new window.google.maps.Map(
      document.getElementById('tour-direction-map'),
      {
        zoom: 15,
        center: {
          lat: 32.7767,
          lng: -96.797
        },
        zoomControl: true,
        disableDefaultUI: true
      }
    )

    this.directionsDisplay.setMap(this.map)
    this.calculateAndDisplayRoute()
  }

  getLatLng = listing =>
    `${listing.location.latitude},${listing.location.longitude}`

  calculateAndDisplayRoute = () => {
    const { locations } = this.props

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

    this.setState({ hasMarker: true })
  }

  render() {
    return (
      <Container
        id="tour-direction-map"
        isCalculating={this.state.isCalculating}
        style={{ height: '15rem', width: '100%' }}
      />
    )
  }
}

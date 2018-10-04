import React from 'react'

import { loadJS } from '../../../../../../../utils/load-js'
import config from '../../../../../../../../config/public/development'

import { Container } from './styled'

export class Map extends React.Component {
  state = {
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

  initMap = () => {
    const directionsService = new window.google.maps.DirectionsService()
    const directionsDisplay = new window.google.maps.DirectionsRenderer()
    const map = new window.google.maps.Map(
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

    directionsDisplay.setMap(map)
    this.calculateAndDisplayRoute(directionsService, directionsDisplay)
  }

  getLatLng = listing =>
    `${listing.location.latitude},${listing.location.longitude}`

  calculateAndDisplayRoute = (directionsService, directionsDisplay) => {
    const { locations } = this.props

    this.setState({ isCalculating: true })

    directionsService.route(
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
          directionsDisplay.setDirections(response)
          this.setState({ isCalculating: false })
        } else {
          console.log(`Directions request failed due to ${status}`)
          this.setState({ isCalculating: false })
        }
      }
    )
  }

  render() {
    return (
      <Container
        id="tour-direction-map"
        isCalculating={this.state.isCalculating}
        style={{ height: '13rem', width: '100%' }}
      />
    )
  }
}

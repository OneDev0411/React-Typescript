import React from 'react'

import PropTypes from 'prop-types'

import { loadMapLibraries } from '@app/utils/google-map-api'

import config from '../../../../../config/public'
import { DEFAULT_OPTIONS } from '../helpers/default-options'
import { Container } from '../styled'

const propTypes = {
  id: PropTypes.string.isRequired,
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired
  }).isRequired,
  options: PropTypes.shape()
}

const defaultProps = {
  options: {}
}

export class SingleMarkerMap extends React.Component {
  componentDidMount() {
    const { id } = this.props

    window[id] = this.initMap

    const googleMapAPIParams = {
      key: config.google.api_key,
      callback: id
    }

    // Load google maps places if is not loaded yet
    if (!window.google) {
      loadMapLibraries(googleMapAPIParams)
    } else {
      this.initMap()
    }
  }

  initMap = () => {
    if (!this.props.location) {
      return null
    }

    const { latitude, longitude } = this.props.location

    const map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      {
        ...DEFAULT_OPTIONS,
        center: {
          lat: latitude,
          lng: longitude
        },
        ...this.props.options
      }
    )

    const marker = new window.google.maps.Marker({
      position: new window.google.maps.LatLng(latitude, longitude)
    })

    marker.setMap(map)
  }

  render() {
    return <Container id={this.props.id} />
  }
}

SingleMarkerMap.propTypes = propTypes
SingleMarkerMap.defaultProps = defaultProps

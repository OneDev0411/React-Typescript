import React from 'react'
import PropTypes from 'prop-types'

import config from '../../../../../config/public'
import { loadJS } from '../../../../utils/load-js'

import { Container } from '../styled'
import { DEFAULT_OPTIONS } from '../helpers/default-options'

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

    if (!window.google) {
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${config.google.api_key}&callback=${id}`
      )
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

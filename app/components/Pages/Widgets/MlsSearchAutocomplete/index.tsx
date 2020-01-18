import { Component } from 'react'

import config from '../../../../../config/public'

interface Props {
  id: string
  brand: IBrand
}

export default class MlsSearchAutocomplete extends Component<Props> {
  componentDidMount() {
    const GoogleMapsLoader = require('google-maps')

    GoogleMapsLoader.LIBRARIES = ['places']
    GoogleMapsLoader.KEY = config.google.api_key
    GoogleMapsLoader.load(google => {
      this.initGoogleSearch(google)
    })
  }

  initGoogleSearch = google => {
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(this.props.id)
    )

    const geolocation = {
      lat: 32.7767,
      lng: -96.797
    }

    const circle = new google.maps.Circle({
      center: geolocation,
      radius: 500
    })

    autocomplete.setBounds(circle.getBounds())

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      let q = place.formatted_address

      // Place not selected
      if (!q) {
        q = place.name
      }

      this.submitHandler(q)
    })
  }

  submitHandler = q => {
    const { brand } = this.props

    // Send to search map
    if (q) {
      if (brand && brand.assets.map_url) {
        window.top.location.href = `${brand.assets.map_url}?q=${q}`
      } else {
        window.top.location.href = `https://rechat.com/dashboard/mls/?q=${q}`
      }
    }
  }

  render() {
    return this.props.children
  }
}

// Search.js
import S from 'shorti'
import React, { Component } from 'react'
import { FormControl } from 'react-bootstrap'
import config from '../../../../../config/public'

export default class Search extends Component {
  componentDidMount() {
    const GoogleMapsLoader = require('google-maps')
    GoogleMapsLoader.LIBRARIES = ['places']
    GoogleMapsLoader.KEY = config.google.api_key
    GoogleMapsLoader.load(google => {
      this.initGoogleSearch(google)
    })
  }

  _submitHandler(q) {
    const { data } = this.props
    // Send to search map
    if (q) {
      if (data.brand && data.brand.assets.map_url) {
        window.top.location.href = `${data.brand.assets.map_url}?q=${q}`
      } else {
        window.top.location.href = `https://rechat.com/dashboard/mls/?q=${q}`
      }
    }
  }

  initGoogleSearch(google) {
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('google_search')
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
      this._submitHandler(q)
    })
  }

  render() {
    const { data } = this.props

    return (
      <div>
        <div
          style={S(
            `absolute z-0 t-0 l-0 w-100p h-100p bg-cover bg-center bg-url(${data.brand &&
            data.brand.assets.search_bg
              ? data.brand.assets.search_bg
              : ''})`
          )}
        />
        <div style={S('absolute z-1 t-0 l-0 w-100p h-100p bg-000 op-.5')} />
        <div style={S('relative z-2 p-10')}>
          <div style={S('relative t-190 maxw-770 center-block')}>
            <div
              style={S('color-fff text-center font-58 mb-30')}
              className="tempo"
            >
              {data.brand && data.brand.messages.search_headline
                ? data.brand.messages.search_headline
                : ''}
            </div>
            <FormControl
              id="google_search"
              style={S('h-76 border-none')}
              type="text"
              bsSize="large"
              placeholder="Search for an address, neighborhood, or MLS#"
            />
            <div style={S('pull-right z-0 mt-5')}>
              <a
                style={S('color-fff')}
                href="https://rechat.com"
                target="_blank"
              >
                Powered by{' '}
                <span style={S('fw-600')} className="futurastd">
                  Rechat
                </span>
                <sup>TM</sup>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// PropTypes
Search.propTypes = {
  data: React.PropTypes.object
}

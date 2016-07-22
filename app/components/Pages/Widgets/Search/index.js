// Search.js
import React, { Component } from 'react'
import { Input } from 'react-bootstrap'
import S from 'shorti'
import listing_util from '../../../../utils/listing'
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
  initGoogleSearch(google) {
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('google_search'))
    const geolocation = {
      lat: 32.7767,
      lng: -96.7970
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
      if (!q)
        q = place.name
      this.handleSubmit(q)
    })
  }
  handleSubmit(q) {
    const data = this.props.data
    // Send to search map
    if (q) {
      if (data.brand && data.brand.map_url)
        window.top.location.href = data.brand.map_url + '?q=' + q
      else
        window.top.location.href = 'https://rechat.com/dashboard/mls/?q=' + q
    }
  }
  render() {
    const data = this.props.data
    const widget = data.widget
    let listing_list
    if (widget && widget.listings) {
      const listings = widget.listings
      const active_listing = widget.active_listing
      listing_list = listings.map((listing, i) => {
        let bg_color = ''
        if (active_listing === i)
          bg_color = ' bg-EDF7FD'
        let cover_image = <div style={ S('bg-929292 w-87 h-50 color-fff text-center pt-15') }>No Image</div>
        if (listing.cover_image_url) {
          cover_image = (
            <div style={ S(`w-87 h-50 bg-cover bg-center bg-url(${listing.cover_image_url})`) }></div>
          )
        }
        return (
          <div onClick={ this.handleListingClick.bind(this, listing.id) } key={ listing.id } className="search-listings__listing" style={ S('br-3 h-62 relative pointer p-5 ' + bg_color) }>
            <div className="pull-left" style={ S('mr-10') }>{ cover_image }</div>
            <div style={ S('mt-5') } className="pull-left">
              <span style={ S('color-666') }>
                <span style={ S('mr-10') }><b>{ listing.address.street_number } { listing.address.street_name } { listing.address.street_suffix }</b></span>
                <span style={ S('mr-10 font-12 color-929292') }>
                  <span style={ S('font-20 t-5 absolute color-' + listing_util.getStatusColor(listing.status)) }>&#8226;</span>
                  <span style={ S('ml-12') }>{ listing.status }</span>
                </span>
                <br/>
                <span style={ S('color-929292 font-10') }>{ listing.address.city }, { listing.address.state }</span>
              </span>
            </div>
            <div className="clearfix"></div>
          </div>
        )
      })
    }
    let listing_area
    if (listing_list) {
      listing_area = (
        <div style={ { overflow: 'scroll', ...S('bg-fff br-3 maxh-250 z-1 relative t-5n') } }>{ listing_list }</div>
      )
    }
    let loading
    if (widget && widget.is_loading) {
      loading = (
        <div style={ S('absolute r-20 t-140 z-10 color-929292') }>Searching...</div>
      )
    }
    return (
      <div>
        <div style={ S('absolute z-0 t-0 l-0 w-100p h-100p bg-cover bg-center bg-url(http://www.claystapp.com/wp-content/uploads/2016/07/search_widget-e1469211969640.jpg)') }></div>
        <div style={ S('absolute z-1 t-0 l-0 w-100p h-100p bg-000 op-.5') }></div>
        <div style={ S('relative z-2 p-10') }>
          <div style={ S('relative t-190 maxw-770 center-block') }>
            <div style={ S('color-fff text-center font-58 mb-30') } className="tempo">Own a piece of Dallas.</div>
            <Input id="google_search" style={ S('h-76 border-none') } type="text" bsSize="large" placeholder="Search for an address, neighborhood, or MLS#" />
            { loading }
            { listing_area }
            <div style={ S('pull-right z-0 mt-5') }>
              <a style={ S('color-fff') } href="https://rechat.com" target="_blank">Powered by <span style={ S('fw-600') } className="din">Rechat</span><sup>TM</sup></a>
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
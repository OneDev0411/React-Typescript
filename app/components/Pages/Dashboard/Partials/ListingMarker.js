// Partials/ListingMarker.js
import React, { Component } from 'react'
import S from 'shorti'
import listing_util from '../../../../utils/listing'
import helpers from '../../../../utils/helpers'
export default class ListingMarker extends Component {
  render() {
    const data = this.props.data
    const listing = this.props.listing
    const property = this.props.property
    const address = this.props.address
    const context = this.props.context
    const status_color = listing_util.getStatusColor(listing.status)
    let price = listing.price
    if (listing.close_price)
      price = listing.close_price
    let price_small = Math.floor(price / 1000).toFixed(2).replace(/[.,]00$/, '')
    let letter = 'K'
    if (price_small > 1000) {
      price_small = (price_small / 1000).toFixed(2).replace(/[.,]00$/, '')
      letter = 'M'
    }
    let active_class = ''
    if (data.listing_map && listing.id === data.listing_map.active_listing || context === 'single')
      active_class = ' active'
    let popup_class = 'hidden'
    if (data.listing_map && listing.id === data.listing_map.listing_popup || data.listing_map && listing.id === data.listing_map.active_listing || context === 'single')
      popup_class = ''
    const square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
    let sold_date
    if (listing.close_date) {
      const sold_date_obj = helpers.friendlyDate(listing.close_date)
      sold_date = `${sold_date_obj.month} ${sold_date_obj.date}, ${sold_date_obj.year}`
    }
    let resize_url
    if (listing.cover_image_url)
      resize_url = listing_util.getResizeUrl(listing.cover_image_url)
    const listing_popup = (
      <div className={ popup_class } style={ S('absolute w-240 t-110n l-35n z-1000 bg-fff border-1-solid-929292') }>
        <div style={ S('pull-left mr-10') }>
          <div style={ S(`w-80 h-80 bg-url(${ resize_url + '?w=160' }) bg-cover bg-center`) }/>
        </div>
        <div style={ S('pull-left pt-10') }>
          <div className="listing-map__marker__popup__title" style={ S('font-12 w-140') }>{ listing_util.addressTitle(address) }</div>
          <div style={ S('font-11') }>{ property.bedroom_count } Beds,&nbsp;
          { property.bathroom_count } Baths,&nbsp;
          { square_feet } Sqft</div>
          <div style={ S('font-11 color-' + listing_util.getStatusColor(listing.status)) }>{ listing.status } { sold_date }</div>
        </div>
      </div>
    )
    let listing_marker = (
      <div className={ 'map__listing-marker' + active_class } style={ S('relative w-70 h-25 br-3') }>
        <div style={ S('absolute l-6 t-8 w-10 h-10 br-100 bg-' + status_color) }></div>
        <div style={ S('absolute r-10 t-6') }>${ price_small }{ letter }</div>
      </div>
    )
    if (listing.open_houses) {
      // Open house marker
      const open_style = {
        ...S('bg-35b863 w-15 h-100p color-fff font-5 pt-3'),
        lineHeight: '5px'
      }
      listing_marker = (
        <div className={ 'map__listing-marker' + active_class } style={ S('relative w-80 h-25 br-3') }>
          <div style={ open_style }>O<br />P<br />E<br />N</div>
          <div style={ S('absolute l-20 t-8 w-10 h-10 br-100 bg-' + status_color) }></div>
          <div style={ S('absolute r-10 t-6') }>${ price_small }{ letter }</div>
        </div>
      )
    }
    return (
      <div>
        { listing_popup }
        { listing_marker }
      </div>
    )
  }
}
ListingMarker.propTypes = {
  data: React.PropTypes.object,
  listing: React.PropTypes.object,
  property: React.PropTypes.object,
  address: React.PropTypes.object,
  context: React.PropTypes.string
}
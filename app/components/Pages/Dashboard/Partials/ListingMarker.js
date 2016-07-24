// Partials/ListingMarker.js
import React, { Component } from 'react'
import S from 'shorti'
import listing_util from '../../../../utils/listing'
import helpers from '../../../../utils/helpers'
export default class ListingMarker extends Component {
  isFavorited(listing) {
    const data = this.props.data
    const user = data.user
    const mls_number = listing.mls_number
    if (user && user.favorite_listings && user.favorite_listings.indexOf(mls_number) !== -1)
      return true
    return false
  }
  getSocialBadge(listing) {
    let badge_style = S('absolute l-4 pr-4 t-3 w-20 h-20 border-right-1-solid-dbdbdb')
    let social_icon
    if (listing.commented_by || listing.shared_by) {
      social_icon = 'comment-bubble'
      badge_style = {
        ...badge_style,
        ...S('t-4')
      }
    }
    if (this.isFavorited(listing))
      social_icon = 'heart'
    if (listing.open_houses) {
      badge_style = {
        ...badge_style,
        ...S('l-18')
      }
    }
    return (
      <div style={ badge_style }>
        <img src={ '/images/dashboard/mls/marker/' + social_icon + '.svg' } />
      </div>
    )
  }
  render() {
    const data = this.props.data
    const user = data.user
    const listing = this.props.listing
    const listing_map = data.listing_map
    const property = this.props.property
    const address = this.props.address
    const context = this.props.context
    const status_color = listing_util.getStatusColor(listing.status)
    let price = listing.price
    if (listing.close_price && user && user.user_type === 'Agent')
      price = listing.close_price
    const price_small = listing_util.getSmallPrice(price)
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
    let social_info
    if (listing.shared_by && listing.shared_by.length) {
      social_info = 'Shared by '
      listing.shared_by.forEach((shared_user, shared_i) => {
        if (shared_user.id === user.id)
          social_info += 'You' + (shared_i === listing.shared_by.length - 1 ? '' : ', ')
        else
          social_info += (shared_user.first_name.trim() ? shared_user.first_name : shared_user.email) + (shared_i === listing.shared_by.length - 1 ? '' : ', ')
      })
    }
    if (listing.commented_by && listing.commented_by.length) {
      social_info = 'Commented by '
      listing.commented_by.forEach((commented_user, comment_i) => {
        if (commented_user.id === user.id)
          social_info += 'You' + (comment_i === listing.commented_by.length - 1 ? '' : ', ')
        else
          social_info += (commented_user.first_name.trim() ? commented_user.first_name : commented_user.email) + (comment_i === listing.commented_by.length - 1 ? '' : ', ')
      })
    }
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
          <div style={ S('w-120 overflow-hidden pb-5') }>{ social_info }</div>
        </div>
      </div>
    )
    let marker_style = S('relative w-70 h-25 br-3')
    let status_style = S('absolute l-6 t-8 w-10 h-10 br-100 bg-' + status_color)
    let viewed_class = ''
    // Social badge
    let social_badge
    if (this.isFavorited(listing) || listing.commented_by) {
      marker_style = {
        ...marker_style,
        ...S('w-95')
      }
      status_style = {
        ...status_style,
        ...S('l-30')
      }
      social_badge = this.getSocialBadge(listing)
    }
    // Brand badge
    let brand_badge
    if (listing.list_office && listing.list_office.brand) {
      brand_badge = (
        <div style={ S(`bg-url(${listing.list_office.brand.logo_url}) w-20 h-20 bg-center bg-cover absolute l-3 t-3`) }></div>
      )
      marker_style = {
        ...marker_style,
        ...S('w-95')
      }
      status_style = {
        ...status_style,
        ...S('l-30')
      }
    }
    if (listing_map && listing_map.listings_viewed && listing_map.listings_viewed.indexOf(listing.id) !== -1)
      viewed_class = ' viewed'
    let listing_marker = (
      <div className={ 'map__listing-marker' + active_class + viewed_class } style={ marker_style }>
        { brand_badge }
        { social_badge }
        <div style={ status_style }></div>
        <div style={ S('absolute r-10 t-5') }>${ price_small }</div>
      </div>
    )
    // Open house
    if (listing.open_houses) {
      // Open house marker
      const open_style = {
        ...S('bg-35b863 w-15 h-100p color-fff font-5 pt-3'),
        lineHeight: '5px'
      }
      status_style = {
        ...status_style,
        ...S('l-20')
      }
      marker_style = { ...marker_style, ...S('w-90') }
      if (this.isFavorited(listing) || listing.commented_by) {
        marker_style = {
          ...marker_style,
          ...S('w-110')
        }
        status_style = {
          ...status_style,
          ...S('l-46')
        }
        social_badge = this.getSocialBadge(listing)
      }
      if (listing_map && listing_map.listings_viewed && listing_map.listings_viewed.indexOf(listing.id) !== -1)
        viewed_class = ' viewed'
      listing_marker = (
        <div className={ 'map__listing-marker' + active_class + viewed_class } style={ marker_style }>
          <div style={ open_style }>O<br />P<br />E<br />N</div>
          { social_badge }
          <div style={ status_style }></div>
          <div style={ S('absolute r-10 t-5') }>${ price_small }</div>
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
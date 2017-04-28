// Partials/ListingCard.js
import React, { Component } from 'react'
import S from 'shorti'
import controller from '../../controller'
import listing_util from '../../../../../utils/listing'
import helpers from '../../../../../utils/helpers'
import FavoriteHeart from '../../Partials/FavoriteHeart'
export default class ListingCard extends Component {
  isFavorited(listing_id) {
    return controller.listing_card.isFavorited(listing_id)
  }
  getUpdateText(last_update) {
    let update_text
    switch (last_update) {
      case 'New':
        update_text = 'NEW LISTING'
        break
      case 'PriceDrop':
        update_text = 'PRICE DROP!'
        break
      case 'StatusChange':
        update_text = 'STATUS CHANGE'
        break
      case 'PriceIncrease':
        update_text = 'PRICE INCREASE!'
        break
      default:
        return update_text
    }
    return update_text
  }
  getBadgeWidth(last_update) {
    let badge_width = 100
    switch (last_update) {
      case 'New':
        badge_width = 100
        break
      case 'PriceDrop':
        badge_width = 160
        break
      case 'StatusChange':
        badge_width = 160
        break
      case 'PriceIncrease':
        badge_width = 180
        break
      default:
        return badge_width
    }
    return badge_width
  }
  render() {
    const listing = this.props.listing
    let property = listing.property
    if (!property)
      property = listing.compact_property
    let address = listing.address
    if (!address)
      address = property.address
    const square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
    const listing_card_style = {
      ...S('w-375 h-270 mr-20 mb-20 pull-left br-3 pointer relative'),
      boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.2)'
    }
    const listing_image_style = {
      ...S(`bg-cover bg-url(${listing_util.getResizeUrl(listing.cover_image_url)}?w=800) bg-center w-375 h-270 relative br-3`)
    }
    const overlay_style = {
      ...S('bg-000 absolute w-100p h-100p br-3'),
      opacity: '.3'
    }
    let details_area = (
      <div style={{ opacity: '.9' }}>
        <span>{ property.bedroom_count ? property.bedroom_count : 0 } Beds</span>
        &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
        <span>{ property.full_bathroom_count ? property.full_bathroom_count : 0 } Baths</span>
        &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
        <span>{ square_feet } Sqft</span>
        &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
        <span>{ property.year_built ? `Built in ${property.year_built}` : '' }</span>
      </div>
    )
    if (property.property_type === 'Lots & Acreage') {
      const lot_acres = listing_util.squareMetersToAcres(property.lot_square_meters).toFixed(1)
      details_area = (
        <div style={{ opacity: '.9' }}>
          { lot_acres ? <span>{ lot_acres } Acres</span> : '' }
          { property.lot_size_dimensions ? <span>&nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;</span> : '' }
          <span>{ property.lot_size_dimensions ? `Lot Dimensions ${property.lot_size_dimensions}` : '' }</span>
        </div>
      )
    }
    if (property.property_type === 'Residential Lease') {
      details_area = (
        <div style={{ opacity: '.9' }}>
          <span>{ property.bedroom_count ? property.bedroom_count : 0 } Beds</span>
          &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
          <span>{ property.full_bathroom_count ? property.full_bathroom_count : 0 } Baths</span>
          { square_feet ? <span>&nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;</span> : '' }
          { square_feet ? <span>{ square_feet } Sqft</span> : '' }
          { property.pets_yn ? <span>&nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;</span> : '' }
          { property.pets_yn ? <span>{ property.pets_yn ? `Pet Friendly` : '' }</span> : '' }
        </div>
      )
    }
    if (property.property_type === 'Multi-Family') {
      details_area = (
        <div style={{ opacity: '.9' }}>
          <span>{ property.bedroom_count ? property.bedroom_count : 0 } Beds</span>
          &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
          <span>{ property.full_bathroom_count ? property.full_bathroom_count : 0 } Baths</span>
          { square_feet ? <span>&nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;</span> : '' }
          { square_feet ? <span>{ square_feet } Sqft</span> : '' }
          { property.number_of_units ? <span>&nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;</span> : '' }
          <span>{ property.number_of_units ? `${property.number_of_units} Units` : '' }</span>
        </div>
      )
    }
    return (
      <div key={`listing-viewer-${listing.id}-${helpers.randomString(10)}`} style={listing_card_style}>
        {
          this.props.last_update &&
          <div style={ S('absolute color-fff z-10 h-32') }>
            <div style={ S('relative w-100p t-20 l-0') }>
              <div style={ S(`absolute z-0 h-32 bg-000 op-.7 w-${this.getBadgeWidth(this.props.last_update)}`) } />
              <div className="sf" style={ S(`font-14 absolute color-fff z-1 t-6 l-10 w-${this.getBadgeWidth(this.props.last_update)}`) }>{ this.getUpdateText(this.props.last_update) }</div>
            </div>
          </div>
        }
        <FavoriteHeart
          listing={listing}
        />
        <div style={listing_image_style} onClick={controller.listing_viewer.showListingViewer.bind(this, listing)}>
          <div style={overlay_style} />
          <div style={S('absolute b-0 p-10 color-fff')}>
            <div style={S('font-24 fw-500')}>${ helpers.numberWithCommas(listing.price) }</div>
            <div style={{ opacity: '.9' }}>{ listing_util.addressTitle(address) }</div>
            { details_area }
          </div>
        </div>
        {
          /*
          <div style={ S('mt-12 ml-15 font-18') } onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) }>
            <img style={ S('w-23 h-13 mr-5') }src="/static/images/dashboard/mls/eye.svg"/>
            <span style={ S('color-c3c3c3 mr-15 t-1 relative') }>8</span>
            <img style={ S('w-23 h-13 mr-5') }src="/static/images/dashboard/mls/heart.svg"/>
            <span style={ S('color-c3c3c3 mr-20 t-1 relative') }>3</span>
            <img style={ S('w-14 h-13 mr-5') }src="/static/images/dashboard/mls/comment.svg"/>
            <span style={ S('color-c3c3c3 t-1 relative') }>1</span>
            <img onClick={ controller.listing_viewer.showShareListingModal.bind(this, listing) } style={ S('w-17 h-24 mr-15 mt-1 pull-right') }src="/static/images/dashboard/mls/share.svg"/>
          </div>
          */
        }
      </div>
    )
  }
}
ListingCard.propTypes = {
  listing: React.PropTypes.object
}

// Partials/ListingCard.js
import React, { Component } from 'react'
import S from 'shorti'
import controller from '../../controller'
import listing_util from '../../../../../utils/listing'
import helpers from '../../../../../utils/helpers'
import FavoriteHeart from '../../Partials/FavoriteHeart'
import Loading from '../../../../../components/Partials/Loading'

export default class ListingCard extends Component {
  isFavorited(listing_id) {
    return controller.listing_card.isFavorited(listing_id)
  }

  getUpdateText(last_update) {
    switch (last_update) {
      case 'New':
        return 'NEW LISTING'
      case 'PriceDrop':
        return 'PRICE DROP'
      case 'StatusChange':
        return 'STATUS CHANGE'
      case 'OpenHouseAvailable':
        return 'OPEN HOUSE'
      default:
        return last_update.toUpperCase()
    }
  }
  render() {
    const listing = this.props.listing
    let property = listing.property
    if (!property) {
      property = listing.compact_property
    }
    let address = listing.address
    if (!address) {
      address = property.address
    }
    const square_feet = helpers.numberWithCommas(
      Math.floor(listing_util.metersToFeet(property.square_meters))
    )
    const listing_card_style = {
      ...S('w-375 h-270 mr-20 mb-20 pull-left br-3 pointer relative'),
      boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.2)'
    }
    const listing_image_style = {
      ...S(
        `bg-cover bg-url(${listing_util.getResizeUrl(listing.cover_image_url)}?w=800) bg-center w-375 h-270 relative br-3`
      )
    }
    const overlay_style = {
      ...S('bg-000 absolute w-100p h-100p br-3'),
      opacity: '.3'
    }
    let details_area = (
      <div style={{ opacity: '.9' }}>
        <span>{property.bedroom_count ? property.bedroom_count : 0} Beds</span>
        &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
        <span>
          {property.full_bathroom_count ? property.full_bathroom_count : 0}{' '}
          Baths
        </span>
        &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
        <span>{square_feet} Sqft</span>
        &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
        <span>
          {property.year_built ? `Built in ${property.year_built}` : ''}
        </span>
      </div>
    )
    if (property.property_type === 'Lots & Acreage') {
      const lot_acres = listing_util
        .squareMetersToAcres(property.lot_square_meters)
        .toFixed(1)
      details_area = (
        <div style={{ opacity: '.9' }}>
          {lot_acres
            ? <span>
              {lot_acres} Acres
              </span>
            : ''}
          {property.lot_size_dimensions
            ? <span>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>
            : ''}
          <span>
            {property.lot_size_dimensions
              ? `Lot Dimensions ${property.lot_size_dimensions}`
              : ''}
          </span>
        </div>
      )
    }
    if (property.property_type === 'Residential Lease') {
      details_area = (
        <div style={{ opacity: '.9' }}>
          <span>
            {property.bedroom_count ? property.bedroom_count : 0} Beds
          </span>
          &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
          <span>
            {property.full_bathroom_count ? property.full_bathroom_count : 0}
            {' '}
            Baths
          </span>
          {square_feet
            ? <span>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>
            : ''}
          {square_feet
            ? <span>
              {square_feet} Sqft
              </span>
            : ''}
          {property.pets_yn
            ? <span>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>
            : ''}
          {property.pets_yn
            ? <span>
              {property.pets_yn ? 'Pet Friendly' : ''}
            </span>
            : ''}
        </div>
      )
    }
    if (property.property_type === 'Multi-Family') {
      details_area = (
        <div style={{ opacity: '.9' }}>
          <span>
            {property.bedroom_count ? property.bedroom_count : 0} Beds
          </span>
          &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
          <span>
            {property.full_bathroom_count ? property.full_bathroom_count : 0}
            {' '}
            Baths
          </span>
          {square_feet
            ? <span>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>
            : ''}
          {square_feet
            ? <span>
              {square_feet} Sqft
              </span>
            : ''}
          {property.number_of_units
            ? <span>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>
            : ''}
          <span>
            {property.number_of_units
              ? `${property.number_of_units} Units`
              : ''}
          </span>
        </div>
      )
    }
    return (
      <div
        key={`listing-viewer-${listing.id}-${helpers.randomString(10)}`}
        style={listing_card_style}
      >
        <div style={listing_image_style} onClick={this.props.onClick}>
          <div style={overlay_style} />
          <div style={S('absolute b-0 p-10 color-fff')}>
            <div style={S('font-24 fw-500')}>
              ${helpers.numberWithCommas(listing.price)}
            </div>
            <div style={{ opacity: '.9' }}>
              {listing_util.addressTitle(address)}
            </div>
            {details_area}
          </div>
        </div>
        {this.props.last_update &&
          <div
            className="sf"
            style={S('absolute t-20 l-0 font-14 color-fff bg-000 op-.7 p-5')}
          >
            {this.getUpdateText(this.props.last_update)}
          </div>}
        <FavoriteHeart listing={listing} />
        {this.props.isFetching === listing.id &&
          <div className="c-feed-modal__listing-card__loading">
            <Loading />
          </div>}
      </div>
    )
  }
}
ListingCard.propTypes = {
  listing: React.PropTypes.object
}

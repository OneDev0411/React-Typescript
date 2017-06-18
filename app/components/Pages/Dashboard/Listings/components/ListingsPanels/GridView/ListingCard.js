import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import helpers from '../../../../../../../utils/helpers'
import listing_util from '../../../../../../../utils/listing'

import FavoriteHeart from '../../FavoriteHeart'
import { Button, DropdownButton, MenuItem } from 'react-bootstrap'

import { setMapHoveredMarkerId } from '../../../../../../../store_actions/listings/map'

const ListingCard = ({
  listing,
  user,
  activePanel,
  onMouseEnter,
  onMouseLeave
}) => {
  const statusColor = listing_util.getStatusColor(listing.status)
  let property = listing.compact_property
  let address = listing.address

  if (!property) {
    property = listing.property
  }

  if (!address) {
    address = property.address
  }

  const square_feet = helpers.numberWithCommas(
    Math.floor(listing_util.metersToFeet(property.square_meters))
  )

  let price = listing.price
  if (listing.close_price && user && user.user_type === 'Agent') {
    price = listing.close_price
  }

  const backgroundImage = listing.cover_image_url && {
    backgroundImage: `url('${listing.cover_image_url}')`
  }

  return (
    <div
      className="c-listing-card"
      style={backgroundImage}
      onMouseEnter={activePanel === 'map' ? () => onMouseEnter(listing.id) : ''}
      onMouseLeave={activePanel === 'map' ? onMouseLeave : ''}>
      <Link to={`/listings/${listing.id}`} className="c-listing-card__link" />
      <div className="c-listing-card__content-wrapper">
        {statusColor &&
          <div>
            <span
              className="c-listing-card__status"
              style={{ background: `#${statusColor}` }}>
              {listing.status}
            </span>
          </div>}
        <h4 className="c-listing-card__title">
          {listing_util.addressTitle(address)}
        </h4>
        <h5 className="c-listing-card__price">
          ${helpers.numberWithCommas(Math.floor(price))}
        </h5>
        <div className="c-listing-card__details">
          <span>{property.bedroom_count} Beds</span>
          &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
          <span>{property.bathroom_count} Baths</span>
          &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
          <span>{square_feet} Sqft</span>
          &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
          <span>{property.year_built}</span>
        </div>
      </div>
      <div className="c-listing-card__favorite-heart">
        <FavoriteHeart listing={listing} />
      </div>
    </div>
  )
}

export default compose(
  connect(({ data }) => ({ user: data.user }), { setMapHoveredMarkerId }),
  withHandlers({
    onMouseEnter: ({ setMapHoveredMarkerId, tabName }) => id => {
      setMapHoveredMarkerId(tabName, id)
    },
    onMouseLeave: ({ setMapHoveredMarkerId, tabName }) => () => {
      setMapHoveredMarkerId(tabName, -1)
    }
  })
)(ListingCard)

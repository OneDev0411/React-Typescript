import React from 'react'
import helpers from '../../../../../../../utils/helpers'
import listing_util from '../../../../../../../utils/listing'
import FavoriteHeart from '../../../../Partials/FavoriteHeart'
import { Button, DropdownButton, MenuItem } from 'react-bootstrap'

const ListingCard = ({ listing, user }) => {
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
    <div className="c-listing-card" style={backgroundImage}>
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
        </div>
      </div>
      <FavoriteHeart
        listing={listing}
        className="c-listing-card__favarite-icon"
      />
    </div>
  )
}

export default ListingCard

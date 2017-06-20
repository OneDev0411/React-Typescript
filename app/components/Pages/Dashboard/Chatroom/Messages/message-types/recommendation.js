import React from 'react'
import moment from 'moment'
import util from '../../../../../../utils/listing'

// get listing price
const getPrice = (listing, user = {}) => {
  let price = 0

  if (listing.close_price && user.user_type === 'Agent')
    price = listing.close_price

  price = listing.price

  return price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * renders a recommendation(== listing) message
 */
export default ({
  user,
  author,
  message,
  comment,
  recommendation
}) => {
  // get listing
  const { listing } = recommendation
  const { property, status } = listing

  return (
    <div className="recommendation">
      <strong style={{ color: '#9b9a9b' }}>
        Shared a listing:
      </strong>
      { comment }

      <div className="listing">
        {
          listing.cover_image_url &&
          <img src={listing.cover_image_url} />
        }
        <div className="info">
          <div
            className="status"
            style={{ backgroundColor: `#${util.getStatusColor(status)}` }}
          >
            { status}
          </div>

          <div className="address-title">
            { util.addressTitle(property.address) }
          </div>

          <div className="price">
            ${ getPrice(listing, user) }
          </div>

          <ul className="details">
            <li>{ property.bedroom_count } Beds</li>
            <li>{ property.bathroom_count } Baths</li>
            <li>{ util.metersToFeet(property.square_meters) } Sqft</li>
            <li>{ property.lot_square_meters.toFixed(0) } Lot</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

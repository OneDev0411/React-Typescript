import React from 'react'
import moment from 'moment'
import util from '../../../../../../utils/listing'

// get listing price
const getPrice = (listing, user = {}) => {
  if (listing.close_price && user.user_type === 'Agent')
    return listing.close_price

  return listing.price
}

export default ({
  user,
  author,
  message,
  comment,
  recommendation
}) => {
  // get listing
  const { listing } = recommendation
  const { property } = listing

  return (
    <div className="recommendation">
      <strong>
        { author ? 'Shared a Home' : '' }:
        { util.addressTitle(property.address) },
        { property.address.postal_code }
      </strong>

      <div className="card">
        {
          listing.cover_image_url &&
          <img src={listing.cover_image_url} />
        }

        <div className="info">
          <div>price: ${ getPrice(listing, user) }</div>

          { property.bedroom_count } Beds<br/>
          { property.bathroom_count } Bath<br/>
          { util.metersToFeet(property.square_meters) } Sqft<br />
          Built in { property.year_built }
          <div className="message">
            "{comment}"
          </div>
        </div>
      </div>
    </div>
  )
}

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
        Shared a Home
      </strong>

      <div className="card">
        {
          listing.cover_image_url &&
          <img src={listing.cover_image_url} />
        }


      </div>
    </div>
  )
}

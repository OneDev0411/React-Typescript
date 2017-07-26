import React from 'react'
import _ from 'underscore'
import Deal from '../../../../../models/Deal'

/**
 * get listing photo
 */
function getImage(deal) {
  const photo = Deal.get.field(deal, 'photo')

  if (!photo) {
   return false
  }

  return <img src={photo} />
}

/**
 * get listing formatted address
 */
function getListingAddress(deal) {
  return [
    Deal.get.field(deal, 'state'),
    Deal.get.field(deal, 'city'),
    Deal.get.field(deal, 'postal_code')
  ]
  .filter(item => item !== null)
  .join(', ')
}

export default ({
  deal
}) => (
  <div className="listing-card">
    { getImage(deal) }

    <div className="data">
      <div className="status">
        { Deal.get.field(deal, 'listing_status') }
      </div>

      <div className="title">
        { Deal.get.field(deal, 'street_address') }
      </div>
    </div>

  </div>
)

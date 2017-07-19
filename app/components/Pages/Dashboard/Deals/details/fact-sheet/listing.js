import React from 'react'
import _ from 'underscore'
import Deal from '../../../../../../models/Deal'

function getImage(deal) {
  const photo = Deal.get.field(deal, 'photo')

  if (!photo) {
    return false
  }

  return <img src={photo} />
}

export default ({
  deal
}) => (
  <div className="listing">
    <div className="data">
      <strong className="title">
        { Deal.get.field(deal, 'street_address') }
      </strong>
      <span className="subtitle">
        { Deal.get.field(deal, 'state') },&nbsp;
        { Deal.get.field(deal, 'city') },&nbsp;
        { Deal.get.field(deal, 'postal_code') }
      </span>
    </div>

    { getImage(deal) }

    <div className="status">
      Status: <span className="field">{ Deal.get.field(deal, 'listing_status') }</span>
    </div>
  </div>
)

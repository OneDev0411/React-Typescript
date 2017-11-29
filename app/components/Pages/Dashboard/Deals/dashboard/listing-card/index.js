import React from 'react'
import _ from 'underscore'
import cn from 'classnames'
import { browserHistory, Link } from 'react-router'
import Deal from '../../../../../../models/Deal'

function getAddressField(deal, field) {
  if (deal.listing) {
    return deal.mls_context[field]
  }

  return Deal.get.field(deal, field)
}

function getHomeAddress(deal) {
  const unitNumber = getAddressField(deal, 'unit_number')
  const street_number = getAddressField(deal, 'street_number')
  const street_name = getAddressField(deal, 'street_name')
  const street_suffix = getAddressField(deal, 'street_suffix')

  return [
    street_number,
    street_name,
    street_suffix,
    unitNumber ? `, #${unitNumber}` : null
  ]
  .filter(item => item !== null)
  .join(' ')
}

function getListingAddress(deal) {
  const city = getAddressField(deal, 'city')
  const state = getAddressField(deal, 'state_code')
  const postalCode = getAddressField(deal, 'postal_code')

  const address = [
    city ? `${city},` : null,
    state,
    postalCode
  ]
  .filter(item => item !== null)
  .join(' ')

  if (address.length === 0) {
    return Deal.get.clientNames(deal)
  }

  return address
}

function openListing(deal) {
  if (deal.listing) {
    browserHistory.push(`/dashboard/mls/${deal.listing}`)
  }
}

export default ({
  deal,
  showBackButton = true
}) => {
  const photo = Deal.get.field(deal, 'photo')

  return (
    <div className="deal-listing-card">

      <div
        className={cn('listing-photo', { hasListing: deal.listing })}
        onClick={() => openListing(deal)}
      >
        <img
          src={photo || "/static/images/deals/group-146.svg"}
        />

        <span className="view-btn">
          VIEW
        </span>
      </div>

      <div className="address-info">
        <div className="title">
          { getHomeAddress(deal) }
        </div>

        <div className="addr">
          { getListingAddress(deal) }
        </div>

        <img
          onClick={() => openListing(deal)}
          className={cn('open-listing', { hidden: !deal.listing })}
          src="/static/images/deals/view-listing.svg"
        />
      </div>

    </div>
  )
}

import React from 'react'
import _ from 'underscore'
import { browserHistory, Link } from 'react-router'
import Deal from '../../../../../../models/Deal'

function getHomeAddress(deal) {
  const unitNumber = Deal.get.field(deal, 'unit_number')

  return [
    Deal.get.field(deal, 'street_number'),
    Deal.get.field(deal, 'street_name'),
    Deal.get.field(deal, 'street_suffix'),
    unitNumber ? `, #${unitNumber}` : null
  ]
  .filter(item => item !== null)
  .join(' ')
}

function getListingAddress(deal) {
  const city = Deal.get.field(deal, 'city')
  const state = Deal.get.field(deal, 'state_code')
  const postalCode = Deal.get.field(deal, 'postal_code')

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

function goBack() {
  browserHistory.push('/dashboard/deals')
}

export default ({
  deal,
  showBackButton = true
}) => {
  const photo = Deal.get.field(deal, 'photo')

  return (
    <div className="deal-listing-card">

      {
        showBackButton &&
        <div
          className="back"
          onClick={() => goBack()}
        >
          <i className="fa fa-angle-left fa-3x" />
        </div>
      }

      {
        photo &&
        <img
          className="listing-photo"
          src={photo}
        />
      }

      {
        !photo &&
        <img
          className="placeholder"
          src="/static/images/deals/group-146.svg"
        />
      }

      <div
        className="data"
        onClick={() => openListing(deal)}
        style={{ cursor: deal.listing ? 'pointer' : 'auto' }}
      >

        <div className="address-info">
          <div className="title">
            { getHomeAddress(deal) }
          </div>

          <div className="addr">
            { getListingAddress(deal) }
          </div>
        </div>

        <div className="view">
          {
            deal.listing &&
            <img src="/static/images/deals/view-listing.svg" />
          }
        </div>
      </div>

    </div>
  )
}

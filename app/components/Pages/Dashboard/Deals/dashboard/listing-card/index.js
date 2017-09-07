import React from 'react'
import _ from 'underscore'
import { browserHistory } from 'react-router'
import Deal from '../../../../../../models/Deal'


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

function goBack() {
  browserHistory.push('/dashboard/deals')
}

export default ({
  deal,
  noBackButton = false
}) => {
  const status = Deal.get.field(deal, 'listing_status')
  const photo = Deal.get.field(deal, 'photo')

  return (
    <div className="listing-card">

      {
        !noBackButton &&
        <div
          className="back"
          onClick={() => goBack()}
        >
          <i className="fa fa-angle-left fa-3x" />
        </div>
      }

      {
        photo &&
        <img src={photo} />
      }

      {
        !photo &&
        <img
          className="placeholder"
          src="/static/images/deals/group-146.svg"
        />
      }

      <div className="data">

        {
          status &&
          <span className="listing-status">
            { status }
          </span>
        }

        <div className="title">
          { Deal.get.field(deal, 'street_address') }
        </div>

        <div className="addr">
          { getListingAddress(deal) }
        </div>
      </div>

    </div>
  )
}

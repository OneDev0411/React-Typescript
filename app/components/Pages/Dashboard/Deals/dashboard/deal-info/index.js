import React from 'react'
import ListingCard from '../mls-listing/listing-card'
import CriticalDates from '../factsheet/critical-dates'
import ListingInfo from '../factsheet/listing-info'
import Commission from '../factsheet/commission'
import Roles from '../roles'
import MlsListing from '../mls-listing'
import DealEmail from '../deal-email'

export default ({ deal, showBackButton = true }) => {
  const isWebkit = 'WebkitAppearance' in document.documentElement.style

  return (
    <div className="scrollable" data-simplebar={!isWebkit || null}>
      <div className="deal-info__inner">
        <ListingCard deal={deal} showBackButton={showBackButton} />

        <MlsListing deal={deal} />
        <DealEmail deal={deal} />

        <div className="deal-fact-sheet">
          <CriticalDates deal={deal} />
        </div>

        <Roles deal={deal} allowDeleteRole />

        <div className="deal-fact-sheet">
          <ListingInfo deal={deal} />

          <Commission deal={deal} />
        </div>
      </div>
    </div>
  )
}

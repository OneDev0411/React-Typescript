import React from 'react'
import ListingCard from '../mls-listing/listing-card'
import CriticalDates from '../factsheet/critical-dates'
import ListingInfo from '../factsheet/listing-info'
import Commission from '../factsheet/commission'
import Roles from '../roles'
import MlsListing from '../mls-listing'

export default ({
  deal,
  showBackButton = true
}) => (
  <div className="scrollable">

    <ListingCard
      deal={deal}
      showBackButton={showBackButton}
    />

    <MlsListing
      deal={deal}
    />

    <div className="deal-fact-sheet">
      <CriticalDates
        deal={deal}
      />
    </div>

    <Roles
      deal={deal}
    />

    <div className="deal-fact-sheet">
      <ListingInfo
        deal={deal}
      />

      <Commission
        deal={deal}
      />
    </div>
  </div>
)

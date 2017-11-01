import React from 'react'
import ListingCard from '../listing-card'
import CriticalDates from '../factsheet/critical-dates'
import ListingInfo from '../factsheet/listing-info'
import Commission from '../factsheet/commission'
// import FactSheet from '../factsheet'
import Roles from '../roles'
import AddContract from '../add-contract'
import ArchiveDeal from '../archive-deal'
import MlsListing from '../mls-listing'

export default ({
  deal,
  showBackButton = true
}) => (
  <div>
    <ListingCard
      deal={deal}
      showBackButton={showBackButton}
    />

    <div className="scrollable">
      <MlsListing
        deal={deal}
      />

      <AddContract
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

      <ArchiveDeal
        deal={deal}
      />
    </div>
  </div>
)

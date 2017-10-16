import React from 'react'
import ListingCard from '../listing-card'
import FactSheet from '../factsheet'
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

      <Roles
        deal={deal}
      />

      <FactSheet
        deal={deal}
      />

      <ArchiveDeal
        deal={deal}
      />
    </div>
  </div>
)

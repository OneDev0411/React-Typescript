import React from 'react'
import ListingCard from '../listing-card'
import FactSheet from '../factsheet'
import Roles from '../roles'
import AddContract from '../add-contract'

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
      <AddContract
        deal={deal}
      />

      <Roles
        deal={deal}
      />

      <FactSheet
        deal={deal}
      />
    </div>
  </div>
)

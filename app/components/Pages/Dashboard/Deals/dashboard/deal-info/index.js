import React from 'react'
import ListingCard from '../listing-card'
import ListingViewer from '../listing-viewer'
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

    <AddContract
      deal={deal}
    />

    <ListingViewer
      deal={deal}
    />

    <div className="scrollable">
      <Roles deal={deal} />
      <FactSheet deal={deal} />
    </div>
  </div>
)

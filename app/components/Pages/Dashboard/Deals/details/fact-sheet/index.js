import React from 'react'
import Commission from './commission'
import CriticalDates from './critical-dates'
import ListingInfo from './listing-info'
import Listing from './listing'

export default ({
  deal
}) => (
  <div className="deal-fact-sheet">
    <Listing deal={deal} />
    <Commission />
    <CriticalDates />
    <ListingInfo />
  </div>
)

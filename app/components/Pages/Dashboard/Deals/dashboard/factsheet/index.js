import React from 'react'
import Commission from './commission'
import CriticalDates from './critical-dates'
import ListingInfo from './listing-info'

export default ({
  deal
}) => (
  <div className="deal-fact-sheet">
    <Listing deal={deal} />
    <Commission />
    <CriticalDates />
  </div>
)

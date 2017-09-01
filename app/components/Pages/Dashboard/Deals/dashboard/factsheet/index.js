import React from 'react'
import Commission from './commission'
import CriticalDates from './critical-dates'
import ListingInfo from './listing-info'

export default ({
  deal
}) => (
  <div className="deal-fact-sheet">
    <CriticalDates deal={deal} />
    <ListingInfo deal={deal} />
    <Commission deal={deal} />
  </div>
)

import React from 'react'
import Context from '../../../../../../../models/DealContext'
import Render from '../renderer'

export default ({ deal }) => {
  const table = Context.getFactsheetSection(deal, 'Listing')

  if (table.length === 0) {
    return false
  }

  return (
    <div className="deal-info-section">
      <Render
        sectionId="listing"
        deal={deal}
        title="LISTING INFORMATION"
        table={table}
      />
    </div>
  )
}

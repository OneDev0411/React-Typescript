import React from 'react'
import Deal from '../../../../../../../models/Deal'
import Context from '../../../../../../../models/DealContext'
import Items from '../items'

export default ({ deal }) => {
  const table = Context.getFactsheetSection(deal, 'Listing')
  if (table.length === 0) {
    return false
  }

  return (
    <div className="deal-info-section">
      <Items
        deal={deal}
        title="LISTING INFORMATION"
        table={table}
        getValue={Context.getValue}
      />
    </div>
  )
}

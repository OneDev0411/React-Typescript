import React from 'react'
import Deal from '../../../../../../../models/Deal'
import Context from '../../../../../../../models/DealContext'
import Items from '../items'

export default ({ deal }) => {
  const table = Context.getFactsheetSection(deal, 'CDA')
  if (table.length === 0) {
    return false
  }

  return (
    <div className="deal-info-section">
      <Items
        deal={deal}
        title="CDA INFORMATION"
        table={table}
        getValue={Context.getValue}
      />
    </div>
  )
}

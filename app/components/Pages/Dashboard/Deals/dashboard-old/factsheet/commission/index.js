import React from 'react'
import Context from '../../../../../../../models/Deal/helpers/dynamic-context'
import Render from '../renderer'

export default ({ deal }) => {
  const table = Context.getFactsheetSection(deal, 'CDA')

  if (table.length === 0) {
    return false
  }

  return (
    <div className="deal-info-section">
      <Render
        sectionId="cda"
        deal={deal}
        title="CDA INFORMATION"
        table={table}
      />
    </div>
  )
}

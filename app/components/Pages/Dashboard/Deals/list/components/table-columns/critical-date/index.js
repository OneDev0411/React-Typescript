import React from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap'

import DealContext from '../../../../../../../../models/DealContext'
import CriticalDates from '../../../../dashboard/factsheet/critical-dates'

const CriticalDate = ({ deal, rowId, rowsCount }) => {
  const table = DealContext.getFactsheetSection(deal, 'CriticalDates')

  if (table.length === 0) {
    return <span />
  }

  return (
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement={rowId > 3 && rowId + 3 >= rowsCount ? 'top' : 'bottom'}
      overlay={
        <Popover
          className="deal-list--popover"
          id={`popover-trigger-factsheet-${deal.id}`}
        >
          <CriticalDates deal={deal} showTitle={false} />
        </Popover>
      }
    >
      <span className="hoverable">{CriticalDates.getNextDate(deal)}</span>
    </OverlayTrigger>
  )
}

export default CriticalDate

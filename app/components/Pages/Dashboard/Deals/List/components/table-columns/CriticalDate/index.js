import React from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap'

import DealContext from 'models/Deal/helpers/dynamic-context'

import FactsheetSection from '../../../../Dashboard/Factsheet'
import { getNextDate, getNextDateValue } from '../../../../utils/critical-dates'

export const getCriticalDateNextValue = deal => getNextDateValue(deal)

export default function CriticalDate(props) {
  const { deal, rowId, rowsCount } = props
  const table = DealContext.getFactsheetSection(deal, 'CriticalDates')

  if (table.length === 0) {
    return <span />
  }

  // get next critical date
  const nextDate = getNextDate(deal)

  if (!nextDate) {
    return 'No closing date'
  }

  return (
    <OverlayTrigger
      trigger={['hover']}
      placement={rowId > 3 && rowId + 3 >= rowsCount ? 'top' : 'bottom'}
      overlay={
        <Popover
          className="deal-list--popover no-padding"
          id={`popover-trigger-factsheet-${deal.id}`}
        >
          <FactsheetSection
            showDivider={false}
            display
            deal={deal}
            isBackOffice={false}
            section="CriticalDates"
          />
        </Popover>
      }
    >
      <span className="hoverable">{nextDate}</span>
    </OverlayTrigger>
  )
}

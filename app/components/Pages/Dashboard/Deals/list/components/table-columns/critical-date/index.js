import React from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import styled from 'styled-components'

import DealContext from '../../../../../../../../models/DealContext'
import CriticalDates from '../../../../dashboard/factsheet/critical-dates'
import { grey } from '../../../../../../../../views/utils/colors'

export const getNextDateValue = deal => CriticalDates.getNextDateValue(deal)

const NoCriticalDate = styled.div`
  color: ${grey.A550};
`

const CriticalDate = ({ deal, rowId, rowsCount }) => {
  const table = DealContext.getFactsheetSection(deal, 'CriticalDates')

  if (table.length === 0) {
    return (
      <NoCriticalDate className="blackHover">No Critical Dates</NoCriticalDate>
    )
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
      <div className="primaryHover inline">
        {CriticalDates.getNextDate(deal)}
      </div>
    </OverlayTrigger>
  )
}

export default CriticalDate

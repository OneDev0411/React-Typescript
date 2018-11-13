import React from 'react'
import styled from 'styled-components'

import PopOver from 'components/Popover'

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
      <NoCriticalDate className="hover-color--black">
        No Critical Dates
      </NoCriticalDate>
    )
  }

  return (
    <PopOver
      containerStyle={{ display: 'inline-block' }}
      placement={rowId > 3 && rowId + 3 >= rowsCount ? 'top' : 'bottom'}
      caption={<CriticalDates deal={deal} showTitle={false} />}
      id={`popover-trigger-factSheet-${deal.id}`}
    >
      <div className="primaryHover">{CriticalDates.getNextDate(deal)}</div>
    </PopOver>
  )
}

export default CriticalDate

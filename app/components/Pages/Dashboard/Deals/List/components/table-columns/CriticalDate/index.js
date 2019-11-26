import React from 'react'

import Flex from 'styled-flex-component'

import PopOver from 'components/Popover'

import DealContext from 'models/Deal/helpers/dynamic-context'
import { getActiveTeamId } from 'utils/user-teams'

import { getNextDate, getNextDateValue } from '../../../../utils/critical-dates'

export const getCriticalDateNextValue = deal => getNextDateValue(deal)

export default function CriticalDate(props) {
  const { deal, rowId, rowsCount } = props
  const activeTeamId = getActiveTeamId(props.user)

  const definitions = DealContext.getFactsheetSection(
    activeTeamId,
    deal,
    'Dates'
  )

  // get next critical date
  const nextDate = getNextDate(deal, activeTeamId)

  if (!nextDate) {
    return 'No closing date'
  }

  return (
    <PopOver
      containerStyle={{ display: 'inline-block' }}
      placement={rowId > 3 && rowId + 3 >= rowsCount ? 'top' : 'bottom'}
      id={`popover-trigger-factsheet-${deal.id}`}
      caption={
        <div className="roles">
          {definitions.map(field => (
            <Flex
              key={field.key}
              justifyBetween
              style={{ marginBottom: '0.5rem' }}
            >
              <div>{field.label}</div>
              <div>{DealContext.getValue(deal, field).value}</div>
            </Flex>
          ))}
        </div>
      }
    >
      <div className="primaryHover">
        <span className="hoverable">{nextDate}</span>
      </div>
    </PopOver>
  )
}

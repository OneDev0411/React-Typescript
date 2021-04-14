import React, { useState } from 'react'

import { Paper } from '@material-ui/core'

import { useSelector } from 'react-redux'

import ContentSizeAwarePopper from 'components/ContentSizeAwarePopper'

import { getActiveTeamId } from 'utils/user-teams'

import { selectBrandContexts } from 'reducers/deals/contexts'

import { IAppState } from 'reducers'

import FactsheetSection from '../../../../Dashboard/Factsheet'
import { getNextDate, getNextDateValue } from './helpers'

export const getCriticalDateNextValue = (deal: IDeal) => getNextDateValue(deal)

interface Props {
  deal: IDeal
  user: IUser
}

export default function CriticalDate({ deal, user }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const contexts = useSelector<IAppState, IDealBrandContext[]>(
    ({ deals }) =>
      selectBrandContexts(deals.contexts, getActiveTeamId(user)!) || []
  )

  const definitions = contexts.filter(context => context.section === 'Dates')

  // get next critical date
  const nextDate = getNextDate(deal, definitions)

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => setAnchorEl(null)

  return (
    <div>
      <span
        style={{
          display: 'inline-block',
          padding: '0.25rem 0',
          cursor: 'help'
        }}
        aria-owns={anchorEl ? 'critical-date-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {nextDate || 'No closing date'}
      </span>

      <ContentSizeAwarePopper
        id="critical-date-popover"
        transition
        placement="bottom-start"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
      >
        <Paper
          style={{
            minWidth: '300px'
          }}
        >
          <FactsheetSection
            definitions={definitions}
            showDivider={false}
            deal={deal}
            isBackOffice={false}
            section="Dates"
          />
        </Paper>
      </ContentSizeAwarePopper>
    </div>
  )
}

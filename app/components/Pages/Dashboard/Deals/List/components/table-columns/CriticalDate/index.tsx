import React, { useState } from 'react'

import { Paper } from '@material-ui/core'

import { makeStyles } from '@material-ui/styles'

import ContentSizeAwarePopper from 'components/ContentSizeAwarePopper'

import FactsheetSection from '../../../../Dashboard/Factsheet'
import { getNextDate, getNextDateValue } from './helpers'
import { useFactsheetContexts } from '../../../../Dashboard/Factsheet/hooks/use-factsheet-contexts'

export const getCriticalDateNextValue = (deal: IDeal) => getNextDateValue(deal)

const useStyles = makeStyles(
  {
    paper: {
      minWidth: '300px',
      maxHeight: '40vh',
      overflow: 'auto'
    }
  },
  {
    name: 'Grid-CriticalDates'
  }
)

interface Props {
  deal: IDeal
}

export default function CriticalDate({ deal }: Props) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const contexts = useFactsheetContexts(deal, 'Dates')

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
    <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
      <span
        style={{
          display: 'inline-block',
          padding: '0.25rem 0',
          cursor: 'help'
        }}
        aria-owns={anchorEl ? 'critical-date-popover' : undefined}
        aria-haspopup="true"
      >
        {nextDate || 'No closing date'}
      </span>

      <ContentSizeAwarePopper
        id="critical-date-popover"
        transition
        placement="bottom-start"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        style={{
          zIndex: 1
        }}
      >
        <Paper className={classes.paper}>
          <FactsheetSection
            definitions={definitions}
            deal={deal}
            isBackOffice={false}
            section="Dates"
          />
        </Paper>
      </ContentSizeAwarePopper>
    </div>
  )
}

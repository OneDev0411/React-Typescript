import React, { useState } from 'react'

import { Paper, makeStyles } from '@material-ui/core'

import ContentSizeAwarePopper from 'components/ContentSizeAwarePopper'

import FactsheetSection from '../../../../Dashboard/Factsheet'
import { useFactsheetContexts } from '../../../../Dashboard/Factsheet/hooks/use-factsheet-contexts'

import { getNextDate, getNextDateValue } from './helpers'

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
  brandChecklists: IBrandChecklist[]
}

export default function CriticalDate({ deal, brandChecklists }: Props) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const contexts = useFactsheetContexts(deal, 'Dates', brandChecklists)

  // get next critical date
  const nextDate = getNextDate(deal, contexts)

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
            disableEditing
            contexts={contexts}
            deal={deal}
            isBackOffice={false}
            section="Dates"
          />
        </Paper>
      </ContentSizeAwarePopper>
    </div>
  )
}

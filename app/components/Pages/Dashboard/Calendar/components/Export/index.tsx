import React from 'react'

import { Button, Popover } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import Flex from 'styled-flex-component'

import { Title, PopoverImage } from './styled'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      pointerEvents: 'none'
    },
    paper: {
      padding: theme.spacing(1),
      maxWidth: '17rem'
    }
  })
)

export function Export() {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => setAnchorEl(event.currentTarget)

  const handlePopoverClose = () => setAnchorEl(null)

  // it should be a string or undefined
  const id = anchorEl ? 'export-popover' : undefined

  return (
    <div>
      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        aria-owns={id}
        aria-haspopup="true"
        href="/dashboard/account/exportCalendar"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        Export Calendar
      </Button>

      <Popover
        id={id}
        className={classes.popover}
        classes={{
          paper: classes.paper
        }}
        open={anchorEl !== null}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <>
          <Title>
            Take your Rechat calendar events with you. Export them to other
            calendars like Outlook, Google, iCal and more
          </Title>

          <Flex style={{ marginTop: '1rem' }} justifyAround>
            <PopoverImage src="/static/images/Calendar/outlook.png" />
            <PopoverImage src="/static/images/Calendar/gcal.png" />
            <PopoverImage src="/static/images/Calendar/ical.png" />
          </Flex>
        </>
      </Popover>
    </div>
  )
}

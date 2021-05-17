import React, { ReactNode } from 'react'
import timeago from 'timeago.js'
import { Typography, Box, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      color: theme.palette.grey[900],
      ...theme.typography.body2
    },
    label: {
      color: theme.palette.grey[900]
    }
  })
)

interface Props {
  contact: IContact
  children?: ReactNode
}

export function LastTouched({ contact, children }: Props) {
  const classes = useStyles()
  const { last_touch: lastTouch, next_touch: nextTouch } = contact

  if (!lastTouch) {
    return (
      <Typography
        variant="body2"
        className={classes.label}
        data-tour-id="last-touch"
      >
        You have not added any touches for this contact.
      </Typography>
    )
  }

  return (
    <Box className={classes.wrapper} data-tour-id="last-touch">
      <span>
        Last Touch was <b>{timeago().format(lastTouch * 1000)}</b>
        {!nextTouch && '.'}
      </span>
      {nextTouch && (
        <span>
          , you wanted to be in touch every{' '}
          <b>{Math.round((nextTouch - lastTouch) / 86400)}</b> days.
        </span>
      )}
      {children}
    </Box>
  )
}

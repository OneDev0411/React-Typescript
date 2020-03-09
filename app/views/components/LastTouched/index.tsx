import React from 'react'
import timeago from 'timeago.js'
import { Typography, Box } from '@material-ui/core'

interface Props {
  contact: IContact
}

export function LastTouched(props: Props) {
  const { last_touch: lastTouch, next_touch: nextTouch } = props.contact

  if (!lastTouch) {
    return <div>You have not added any touches for this contact.</div>
  }

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="body2">
        Last Touch was <b>{timeago().format(lastTouch * 1000)}</b>
      </Typography>
      {nextTouch ? (
        <Typography variant="body2">
          , you wanted to be in touch every{' '}
          <b>{Math.round((nextTouch - lastTouch) / 86400)}</b> days.
        </Typography>
      ) : (
        '.'
      )}
    </Box>
  )
}

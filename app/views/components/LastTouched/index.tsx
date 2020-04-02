import React from 'react'
import timeago from 'timeago.js'
import { Typography } from '@material-ui/core'

interface Props {
  contact: IContact
}

export function LastTouched(props: Props) {
  const { last_touch: lastTouch, next_touch: nextTouch } = props.contact

  if (!lastTouch) {
    return (
      <Typography variant="body2">
        You have not added any touches for this contact.
      </Typography>
    )
  }

  return (
    <div>
      <Typography variant="body2" component="span">
        Last Touch was <b>{timeago().format(lastTouch * 1000)}</b>
        {!nextTouch && '.'}
      </Typography>
      {nextTouch && (
        <Typography variant="body2" component="span">
          , you wanted to be in touch every{' '}
          <b>{Math.round((nextTouch - lastTouch) / 86400)}</b> days.
        </Typography>
      )}
    </div>
  )
}

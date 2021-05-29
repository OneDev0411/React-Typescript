import React from 'react'
import timeago from 'timeago.js'
import { makeStyles, createStyles, Theme, Tooltip } from '@material-ui/core'

interface Props {
  title?: string
  contact: IContact
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    notouch: {
      fontSize: theme.typography.caption.fontSize
    },
    lastTouchLabel: {
      fontSize: theme.typography.caption.fontSize
    },
    lastTouchValue: {
      fontSize: theme.typography.subtitle2.fontSize
    }
  })
)

export default function LastTouched({
  contact,
  title = 'Last Touch: '
}: Props) {
  const classes = useStyles()
  const { last_touch: lastTouch, next_touch: nextTouch } = contact

  if (!lastTouch) {
    return <span className={classes.notouch}>No Touches</span>
  }

  const formattedLastTouch = timeago().format(lastTouch * 1000)

  return (
    <div>
      {nextTouch ? (
        <Tooltip
          title={
            <span>
              You wanted to be in touch
              <br />
              every {Math.round((nextTouch - lastTouch) / 86400)} days.
            </span>
          }
        >
          <span className={classes.lastTouchLabel}>
            {title}
            <b className={classes.lastTouchValue}>{formattedLastTouch}</b>
          </span>
        </Tooltip>
      ) : (
        <span className={classes.lastTouchLabel}>
          {title}
          <b className={classes.lastTouchValue}>{formattedLastTouch}</b>
        </span>
      )}
    </div>
  )
}

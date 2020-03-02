import React from 'react'
import timeago from 'timeago.js'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

import Tooltip from 'components/tooltip'

interface Props {
  contact: IContact
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    notouch: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.palette.grey['400']
    },
    ltLabel: {
      fontSize: theme.typography.caption.fontSize
    },
    ltValue: {
      fontSize: theme.typography.subtitle2.fontSize
    }
  })
)

export default function LastTouched({ contact }: Props) {
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
          captionIsHTML
          isCustom={false}
          multiline
          caption={
            <span>
              You wanted to be in touch
              <br />
              every {Math.round((nextTouch - lastTouch) / 86400)} days.
            </span>
          }
        >
          <span className={classes.ltLabel}>
            Last Touch: <b className={classes.ltValue}>{formattedLastTouch}</b>
          </span>
        </Tooltip>
      ) : (
        <span className={classes.ltLabel}>
          Last Touch: <b className={classes.ltValue}>{formattedLastTouch}</b>
        </span>
      )}
    </div>
  )
}

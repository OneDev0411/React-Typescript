import React from 'react'
import { makeStyles } from '@material-ui/styles'
import cn from 'classnames'

import { sharedStyles } from '../../styles'

interface Props {
  event: ICalendarEvent
  style: React.CSSProperties
}

const useStyles = makeStyles(sharedStyles)

export function EmptyState({ event, style }: Props) {
  const classes = useStyles({})

  return (
    <div style={style}>
      <div className={cn(classes.row, classes.emptyRowStyles)}>
        <div className={classes.container}>
          No event set for this {event.type}!
        </div>
      </div>
    </div>
  )
}

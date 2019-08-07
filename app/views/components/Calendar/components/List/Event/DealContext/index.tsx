import React from 'react'

import { EventIcon } from '../EventIcon'

import styles from '../styles'

interface Props {
  classes: object
  rowStyle: React.CSSProperties
  event: ICalendarEvent
  date: string
}

export function DealContext({ classes, rowStyle, event, date }: Props) {
  return (
    <div style={rowStyle} className={`${classes.root} ${classes.container}`}>
      <div style={styles.centeredContainer}>
        <div style={styles.time}>{date}</div>

        <EventIcon event={event} />

        <div style={styles.title}>
          {event.type_label} for{' '}
          <a href={`/dashboard/deals/${event.deal}`} target="_blank">
            {event.title}
          </a>
        </div>
      </div>

      <div>&nbsp;</div>
    </div>
  )
}

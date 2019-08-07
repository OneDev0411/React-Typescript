import React from 'react'

import { EventIcon } from '../EventIcon'

import styles from '../styles'

interface Props {
  classes: object
  rowStyle: React.CSSProperties
  event: ICalendarEvent
  date: string
}

export function ContactAttribute({ classes, rowStyle, event, date }: Props) {
  return (
    <div style={rowStyle} className={`${classes.root} ${classes.container}`}>
      <div style={styles.centeredContainer}>
        <div style={styles.time}>{date}</div>

        <EventIcon event={event} />

        <div style={styles.title}>
          <a href={`/dashboard/contacts/${event.contact}`} target="_blank">
            {event.full_contact!.display_name}
          </a>
          's {event.event_type}
        </div>
      </div>

      <div>&nbsp;</div>
    </div>
  )
}

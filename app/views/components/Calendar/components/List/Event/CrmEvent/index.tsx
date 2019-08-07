import React, { MouseEvent, memo } from 'react'

import { EventIcon } from '../EventIcon'

import styles from '../styles'
import { Associations } from './Associations'

interface Props {
  classes: object
  rowStyle: React.CSSProperties
  event: ICalendarEvent
  date: string
  onClickCrmEventAssociations(event: ICalendarEvent): void
}

const CrmEvent = memo(
  ({ classes, rowStyle, event, date, onClickCrmEventAssociations }: Props) => {
    const handleSelectEvent = (e: MouseEvent<HTMLElement>) => {
      e.preventDefault()

      onClickCrmEventAssociations(event)
    }

    return (
      <div style={rowStyle} className={`${classes.root} ${classes.container}`}>
        <div style={styles.centeredContainer}>
          <div style={styles.time}>{date}</div>
          <EventIcon event={event} />

          <div style={styles.title}>
            <a
              onClick={handleSelectEvent}
              style={{
                cursor: 'pointer'
              }}
            >
              {event.event_type}
            </a>{' '}
            {getCrmEventTypePreposition(event.event_type)}{' '}
            <Associations
              event={event}
              onClickAssociation={handleSelectEvent}
            />
          </div>
        </div>

        <div>&nbsp;</div>

        {/* {event.event_type === 'Email' && (
          <div style={styles.subtitle}>{event.title}</div>
        )} */}
      </div>
    )
  }
)

function getCrmEventTypePreposition(eventType: string): string {
  switch (eventType) {
    case 'Chat':
    case 'Call':
    case 'In-Person Meeting':
    case 'Other':
      return 'with'

    case 'Mail':
    case 'Email':
    case 'Text':
      return 'to'

    default:
      return ''
  }
}

export default CrmEvent

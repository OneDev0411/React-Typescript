import React, { useContext } from 'react'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import { ListContext } from '../../context'

import { EventContainer } from '../components/EventContainer'

import styles from '../styles'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  nextItem: ICalendarListRow
}

export function EmailCampaign({ style, event, nextItem }: Props) {
  const { setSelectedEvent } = useContext(ListContext)

  return (
    <EventContainer
      style={style}
      event={event}
      nextItem={nextItem}
      icon={{
        color: eventIcons.Email.color,
        element: eventIcons.Email.icon
      }}
      title={
        <div>
          <a
            style={styles.link}
            onClick={e => {
              e.preventDefault()
              setSelectedEvent(event)
            }}
          >
            {event.title || 'No Subject'}
          </a>
        </div>
      }
    />
  )
}

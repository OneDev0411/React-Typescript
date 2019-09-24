import React, { useContext, useMemo, MouseEvent } from 'react'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import { ListContext } from '../../context'

import { EventContainer } from '../EventContainer'
import { Associations } from './Associations'
import OpenHouseRegistration from './actions/OpenHouseRegistration'

import styles from '../styles'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  nextItem: ICalendarListRow
  user: IUser
}

export function CrmTask({ style, event, nextItem }: Props) {
  const { setSelectedEvent } = useContext(ListContext)

  const handleSelectEvent = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setSelectedEvent(event)
  }

  const icon = useMemo(() => {
    if (eventIcons[event.event_type]) {
      return eventIcons[event.event_type]
    }

    if (event.event_type === 'Message') {
      return eventIcons.Mail
    }

    return eventIcons.Other
  }, [event.event_type])

  return (
    <EventContainer
      style={style}
      event={event}
      nextItem={nextItem}
      icon={{
        color: icon.color,
        element: icon.icon
      }}
      title={
        <div style={styles.title}>
          <a
            onClick={handleSelectEvent}
            style={{
              cursor: 'pointer'
            }}
          >
            {event.event_type}
          </a>{' '}
          <Associations event={event} />
        </div>
      }
      subtitle={<>{event.title.replace(/<\/?[^>]+(>|$)/g, '')}</>}
      actions={
        <>
          <OpenHouseRegistration event={event} />
        </>
      }
    />
  )
}

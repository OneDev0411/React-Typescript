import React from 'react'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import MiniContactProfile from 'components/MiniContact'

import { EventContainer } from '../components/EventContainer'
import { TouchDateSubtitle } from './Subtitle'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  nextItem: ICalendarListRow
}

export function NextTouch({ style, event, nextItem }: Props) {
  if (!event.people) {
    return null
  }

  const contact = event.people[0]

  return (
    <EventContainer
      style={style}
      event={event}
      nextItem={nextItem}
      icon={{
        color: eventIcons.TouchDate.color,
        element: eventIcons.TouchDate.icon
      }}
      title={
        <div>
          Contact{' '}
          <MiniContactProfile type="event" data={contact} as="span">
            <a href={`/dashboard/contacts/${event.contact}`} target="_blank">
              {contact.display_name}
            </a>
          </MiniContactProfile>
        </div>
      }
      subtitle={<TouchDateSubtitle event={event} contact={contact} />}
    />
  )
}

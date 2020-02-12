import React from 'react'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import MiniContactProfile from 'components/MiniContact'

import { EventContainer } from '../components/EventContainer'
import { TouchDateSubtitle } from './Subtitle'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
}

export function NextTouch({ style, event, item, nextItem }: Props) {
  if (!event.people) {
    return null
  }

  const contact = event.people[0] as IContact

  return (
    <EventContainer
      style={style}
      event={event}
      Icon={eventIcons.TouchDate.icon}
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

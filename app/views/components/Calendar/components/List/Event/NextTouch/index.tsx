import React from 'react'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import MiniContactProfile from 'components/MiniContact'

import { EventContainer } from '../components/EventContainer'

interface Props {
  event: ICalendarEvent
}

export function NextTouch({ event }: Props) {
  if (!event.people) {
    return null
  }

  const contact = event.people[0] as IContact

  return (
    <EventContainer
      event={event}
      Icon={eventIcons.TouchDate.icon}
      editable={false}
      title={
        <div>
          Touch Reminder:{' '}
          <MiniContactProfile type="event" data={contact} as="span">
            <a href={`/dashboard/contacts/${event.contact}`} target="_blank">
              {contact.display_name}
            </a>
          </MiniContactProfile>
        </div>
      }
    />
  )
}

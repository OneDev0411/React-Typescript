import React, { useMemo } from 'react'

import MiniContactProfile from 'components/MiniContact'
import { importantDatesIcons as contactIcons } from 'views/utils/important-dates-icons'
import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import { EventContainer } from '../components/EventContainer'
import { SendBirthdayCard } from './actions/SendBirthdayCard'

interface Props {
  event: ICalendarEvent
}

export function ContactAttribute({ event }: Props) {
  const icon = useMemo(() => {
    if (contactIcons[event.type_label]) {
      return contactIcons[event.type_label]
    }

    if (event.type === 'birthday' || event.event_type === 'child_birthday') {
      return contactIcons.Birthday
    }

    return eventIcons.Other
  }, [event.event_type, event.type, event.type_label])

  if (!event.people) {
    return null
  }

  const contact = event.people[0] as IContact

  return (
    <EventContainer
      event={event}
      Icon={icon.icon}
      editable={false}
      title={
        <div>
          <MiniContactProfile type="event" data={contact} as="span">
            <a href={`/dashboard/contacts/${event.contact}`} target="_blank">
              {contact.display_name}
            </a>
          </MiniContactProfile>
          's {event.type_label}
        </div>
      }
      actions={
        <>
          <SendBirthdayCard event={event} contact={contact} />
        </>
      }
    />
  )
}

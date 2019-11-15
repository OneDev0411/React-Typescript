import React, { useMemo } from 'react'

import MiniContactProfile from 'components/MiniContact'
import { importantDatesIcons as contactIcons } from 'views/utils/important-dates-icons'
import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import { EventContainer } from '../components/EventContainer'
import { SendBirthdayCard } from './actions/SendBirthdayCard'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  nextItem: ICalendarListRow
}

export function ContactAttribute({ style, event, nextItem }: Props) {
  const icon = useMemo(() => {
    if (contactIcons[event.type_label]) {
      return contactIcons[event.type_label]
    }

    if (event.type === 'birthday' || event.type === 'child_birthday') {
      return contactIcons.Birthday
    }

    return eventIcons.Other
  }, [event.type, event.type_label])

  if (!event.people) {
    return null
  }

  const contact = event.people[0] as IContact

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

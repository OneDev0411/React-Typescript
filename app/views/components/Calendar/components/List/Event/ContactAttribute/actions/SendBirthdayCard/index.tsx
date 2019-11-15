import React from 'react'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

interface Props {
  event: ICalendarEvent
  contact: IContact
}

export function SendBirthdayCard({ event, contact }: Props) {
  if (event.event_type === 'birthday' && !event.metadata.is_partner) {
    return (
      // @ts-ignore js component
      <SendContactCard contact={contact}>Send Birthday Card</SendContactCard>
    )
  }

  return null
}

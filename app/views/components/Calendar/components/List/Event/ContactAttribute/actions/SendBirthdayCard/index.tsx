import React from 'react'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

interface Props {
  event: ICalendarEvent
}

export function SendBirthdayCard({ event }: Props) {
  if (event.event_type === 'birthday' && !event.metadata.is_partner) {
    return (
      // @ts-ignore js component
      <SendContactCard contact={event.full_contact}>
        Send Birthday Card
      </SendContactCard>
    )
  }

  return null
}

import React from 'react'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

interface Props {
  event: ICalendarEvent
}

export function EventActions({ event }: Props) {
  if (event.event_type === 'birthday' && !event.metadata.is_partner) {
    return (
      <SendContactCard
        contactId={event.contact}
        buttonStyle={{
          size: 'small'
        }}
      >
        Send Gift Card
      </SendContactCard>
    )
  }

  return null
}

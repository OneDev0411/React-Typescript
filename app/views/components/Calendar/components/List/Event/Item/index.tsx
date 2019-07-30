import React from 'react'

import ALink from 'components/ALink'

import CrmEvent from './CrmEvent'
import { Title } from './styled'

interface Props {
  event: CalendarEvent
}

export function EventItem(props: Props) {
  const { event } = props

  if (event.object_type === 'crm_task') {
    return <CrmEvent event={event} />
  }

  if (event.object_type === 'contact_attribute') {
    return (
      <Title>
        {event.full_contact!.display_name}'s {event.event_type}
      </Title>
    )
  }

  if (event.object_type === 'deal_context') {
    return (
      <Title>
        {event.type_label} for{' '}
        <ALink to={`/dashboard/deals/${event.deal}`} target="_blank">
          {event.title}
        </ALink>
      </Title>
    )
  }

  return null
}

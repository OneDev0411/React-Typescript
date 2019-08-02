import React from 'react'
import Flex from 'styled-flex-component'

import ALink from 'components/ALink'

import CrmEvent from './CrmEvent'
import { EventIcon } from './Icon'

import { Title } from './styled'

interface Props {
  event: CalendarEvent
  onCrmEventChange: (event: IEvent, type: string) => void
}

export function EventItem(props: Props) {
  const { event } = props

  if (event.object_type === 'crm_task') {
    return <CrmEvent event={event} onCrmEventChange={props.onCrmEventChange} />
  }

  if (event.object_type === 'contact_attribute') {
    return (
      <Flex alignCenter>
        <EventIcon event={event} />
        <Title>
          <ALink to={`/dashboard/contacts/${event.contact}`} target="_blank">
            {event.full_contact!.display_name}
          </ALink>
          's {event.event_type}
        </Title>
      </Flex>
    )
  }

  if (event.object_type === 'deal_context') {
    return (
      <Flex alignCenter>
        <EventIcon event={event} />
        <Title>
          {event.type_label} for{' '}
          <ALink to={`/dashboard/deals/${event.deal}`} target="_blank">
            {event.title}
          </ALink>
        </Title>
      </Flex>
    )
  }

  return null
}

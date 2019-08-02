import React from 'react'
import Flex from 'styled-flex-component'
import fecha from 'fecha'

import { EventItem } from './Item'
import { Container, Time } from './styled'

interface Props {
  style: React.CSSProperties
  item: CalendarEvent
  nextItem: any
  onCrmEventChange: (event: IEvent, type: string) => void
}

export function Event({ item, nextItem, style, onCrmEventChange }: Props) {
  const date =
    item.object_type === 'crm_task'
      ? fecha.format(new Date(item.timestamp), 'hh:mm A')
      : 'All day'

  return (
    <Container style={style} hasBorder={nextItem && !nextItem.is_header}>
      <Flex alignCenter>
        <Time>{date}</Time>
        <EventItem event={item} onCrmEventChange={onCrmEventChange} />
      </Flex>

      <div />
    </Container>
  )
}

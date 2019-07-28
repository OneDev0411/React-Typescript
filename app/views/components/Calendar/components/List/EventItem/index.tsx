import React from 'react'
import Flex from 'styled-flex-component'
import fecha from 'fecha'

// import { eventTypesIcons, EventTypeIcon } from 'views/utils/event-types-icons'
// import {
//   importantDatesIcons,
//   ImportantDatesIcon
// } from 'views/utils/important-dates-icons'

import { Container, Time, Title /* SubTitle */ } from './styled'

interface IProps {
  style: React.CSSProperties
  item: CalendarEvent
  nextItem: any
}

export function EventItem({ item, nextItem, style }: IProps) {
  const date =
    item.object_type === 'crm_task'
      ? fecha.format(new Date(item.timestamp), 'hh:mm A')
      : 'All day'

  return (
    <Container style={style} hasBorder={nextItem && !nextItem.is_header}>
      <Flex alignCenter>
        <Time>{date}</Time>

        <div>
          <Title>{item.title}</Title>
          {/* <SubTitle>{item.title}</SubTitle> */}
        </div>
      </Flex>

      <div>actions</div>
    </Container>
  )
}

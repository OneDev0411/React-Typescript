import React from 'react'

import { Container } from './styled'

interface IProps {
  style: React.CSSProperties
  item: CalendarEvent
}

export function EventItem(props: IProps) {
  return (
    <Container style={props.style}>
      <div>{props.item.title}</div>
      <div>actions</div>
    </Container>
  )
}

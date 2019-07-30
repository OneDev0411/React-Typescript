import React from 'react'
import Flex from 'styled-flex-component'
import fecha from 'fecha'

import { Container } from './styled'

interface IProps {
  activeDate: Date | null
  style: React.CSSProperties
  item: any
}

export function DayHeader(props: IProps) {
  return (
    <Flex alignCenter style={props.style}>
      <Container
        isActive={
          props.activeDate &&
          props.activeDate.toDateString() ===
            new Date(props.item.title).toDateString()
        }
      >
        <Flex
          style={{
            width: '8.5rem'
          }}
        >
          <strong
            style={{
              marginRight: '1rem'
            }}
          >
            {fecha.format(new Date(props.item.title), 'DD')}
          </strong>

          <span
            style={{
              textTransform: 'uppercase'
            }}
          >
            {fecha.format(new Date(props.item.title), 'MMM, ddd')}
          </span>
        </Flex>

        <Flex>{props.item.is_today && <strong>TODAY</strong>}</Flex>
      </Container>
    </Flex>
  )
}

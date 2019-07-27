import React from 'react'
import Flex from 'styled-flex-component'

import { Container } from './styled'

interface IProps {
  activeDate: Date | null
  style: React.CSSProperties
  item: any
}

export function DayTitleItem(props: IProps) {
  const getHeaderBackground = (date: string) =>
    props.activeDate &&
    props.activeDate.toDateString() === new Date(date).toDateString()
      ? '#E5EBFE'
      : '#F5F8FA'

  return (
    <Flex alignCenter style={props.style}>
      <Container backgroundColor={getHeaderBackground(props.item.title)}>
        {new Date(props.item.title).toDateString()}
      </Container>
    </Flex>
  )
}

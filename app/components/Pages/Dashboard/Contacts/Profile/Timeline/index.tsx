import React, { useRef } from 'react'

import List from 'components/Calendar'
import { CalendarRef } from 'components/Calendar/types'

import { Card } from '../styled'
import { Container, Title } from './styled'

interface Props {}

export function Timeline(props: Props) {
  const calendarRef = useRef<CalendarRef>(null)

  const handleOnLoadEvents = () => {}

  const filter = {}

  return (
    <Container>
      <Title>Today Events</Title>

      <Card>
        <List
          ref={calendarRef}
          filter={filter}
          onChangeActiveDate={() => {}}
          onLoadEvents={handleOnLoadEvents}
        />
      </Card>
    </Container>
  )
}

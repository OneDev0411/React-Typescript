import React from 'react'
import styled from 'styled-components'

const Text = styled.p`
  max-width: 558px;
  font-size: 26px;
  text-align: center;
  color: #9c9c9c;
  margin: 0 auto;
  padding: 4em 0;
`

export function EmptyState() {
  return (
    <Text>
      Adding an event can act like tasks, appointments, reminders and historical
      logs of activities.
    </Text>
  )
}

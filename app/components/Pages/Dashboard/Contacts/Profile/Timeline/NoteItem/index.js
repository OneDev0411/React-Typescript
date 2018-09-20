import React from 'react'
import fecha from 'fecha'

import { Container, Title } from '../TaskItem/styled'

export function NoteItem(props) {
  const { note } = props

  return (
    <Container onClick={() => props.onClick(note)}>
      <Title>{note.text}</Title>
      <div style={{ color: '#7f7f7f' }}>
        {fecha.format(new Date(note.created_at * 1000), 'MMM D, YYYY hh:mm A')}
      </div>
    </Container>
  )
}

import React from 'react'
import fecha from 'fecha'

import { Container, Title } from '../TaskItem/styled'

export class NoteItem extends React.Component {
  // onClick = () =>
  //   goTo(
  //     `/crm/tasks/${this.props.task.id}`,
  //     `Contact - ${this.props.contact.display_name}`
  //   )

  render() {
    const { note } = this.props

    return (
      <Container>
        <Title>{note.text}</Title>
        <div style={{ color: '#7f7f7f' }}>
          {fecha.format(
            new Date(note.created_at * 1000),
            'MMM D, YYYY hh:mm A'
          )}
        </div>
      </Container>
    )
  }
}

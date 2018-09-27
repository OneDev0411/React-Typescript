import React from 'react'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import Icon from '../../../../../../../views/components/SvgIcons/Note/IconNote'
import { Divider } from '../../../../../../../views/components/Divider'
import { Container, Title } from '../TaskItem/styled'

export function NoteItem(props) {
  const { note } = props

  return (
    <Container onClick={() => props.onClick(note)}>
      <Flex alignCenter style={{ marginBottom: '2em' }}>
        <Icon style={{ fill: '#E6BF00', marginRight: '0.5em' }} />
        Note
        <Divider margin="0 1em" width="1px" height="16px" />
        <div style={{ color: '#7f7f7f' }}>
          {fecha.format(
            new Date(note.created_at * 1000),
            'MMM D, YYYY hh:mm A'
          )}
        </div>
      </Flex>
      <Title style={{ lineHeight: 1.5 }}>{note.text}</Title>
    </Container>
  )
}

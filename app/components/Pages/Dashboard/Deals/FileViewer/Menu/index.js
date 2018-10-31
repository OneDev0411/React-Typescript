import React from 'react'

import ActionButton from 'components/Button/ActionButton'
import { Container, Actions, Title } from './styled'

export function Menu(props) {
  return (
    <Container>
      <Title>{props.title}</Title>
      <Actions>
        {props.showFactsheetButton && (
          <ActionButton appearance="outline" onClick={props.onToggleFactsheet}>
            {props.isFactsheetOpen ? 'Hide' : 'Show'} Factsheet
          </ActionButton>
        )}

        <ActionButton
          appearance="outline"
          style={{ marginLeft: '1rem' }}
          onClick={props.onToggleComments}
        >
          {props.isCommentsOpen ? 'Hide' : 'Show'} Comments
        </ActionButton>
      </Actions>
    </Container>
  )
}

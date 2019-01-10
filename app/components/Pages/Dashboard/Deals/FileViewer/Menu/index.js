import React from 'react'

import ActionButton from 'components/Button/ActionButton'
import IconButton from 'components/Button/IconButton'
import BackIcon from 'components/SvgIcons/KeyboardArrowLeft/IconKeyboardArrowLeft'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { Container, Actions, Title } from './styled'

export function Menu(props) {
  return (
    <Container>
      <Title>
        <IconButton
          iconSize="XLarge"
          inverse
          isFit
          onClick={props.onClickBackButton}
        >
          <BackIcon />
        </IconButton>

        <TextMiddleTruncate
          text={props.title}
          maxLength={50}
          tooltipPlacement="bottom"
        />
      </Title>

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

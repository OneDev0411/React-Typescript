import React from 'react'
import Flex from 'styled-flex-component'

import { Button } from '@material-ui/core'

import { CloseButton } from 'components/Button/CloseButton'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { Container, Title, Divider } from './styled'

export function Header(props) {
  return (
    <Container>
      <Title>
        <TextMiddleTruncate
          text={props.task.title}
          maxLength={50}
          tooltipPlacement="bottom"
        />
      </Title>

      <Flex alignCenter>
        <Button
          variant="contained"
          color="secondary"
          disabled={!props.isFormLoaded || props.isSaving}
          onClick={props.onSave}
        >
          {props.isSaving ? 'Saving...' : 'Save'}
        </Button>

        <Divider />
        <CloseButton isFit iconSize="large" inverse />
      </Flex>
    </Container>
  )
}

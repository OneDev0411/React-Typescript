import React from 'react'

import {
  SectionContainer,
  Container,
  Title,
  Info,
  Description,
  Button
} from './styled'

export function Section(props) {
  return (
    <SectionContainer>
      <Title>{props.title}</Title>

      <Container>
        <Info>{props.children}</Info>
        {props.button ? (
          props.button()
        ) : (
          <Button {...props.buttonProps} onClick={props.onButtonClick}>
            {props.buttonCaption}
          </Button>
        )}
      </Container>
      <Description>{props.description}</Description>
    </SectionContainer>
  )
}

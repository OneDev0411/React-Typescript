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
    <SectionContainer style={props.styles.mainContainer}>
      <Title>{props.title}</Title>

      <Container style={props.styles.container}>
        <Info style={props.styles.info}>{props.children}</Info>
        {props.button ? (
          props.button()
        ) : (
          <Button {...props.buttonProps} onClick={props.onButtonClick}>
            {props.buttonCaption}
          </Button>
        )}
      </Container>
      <Description style={props.styles.description}>
        {props.description}
      </Description>
    </SectionContainer>
  )
}

Section.defaultProps = {
  styles: {}
}

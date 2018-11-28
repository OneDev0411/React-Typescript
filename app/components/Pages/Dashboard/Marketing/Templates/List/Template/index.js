import React from 'react'
import Flex from 'styled-flex-component'

import Button from 'components/Button/ActionButton'

import { Container } from './styled'

export function Template(props) {
  const { template } = props
  const src = `${template.url}/thumbnail.`

  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      {template.video ? (
        // eslint-disable-next-line
        <video controls>
          <source src={`${src}webm`} type="video/webm" />
          <p>Sorry, your browser doesn't support embedded videos.</p>
        </video>
      ) : (
        <img src={`${src}png`} alt={template.name} />
      )}
      <Flex justifyBetween className="action-bar">
        <Button size="small" appearance="outline" onClick={props.handlePreview}>
          Preview
        </Button>
        <Button size="small" onClick={props.handleCustomize}>
          Customize
        </Button>
      </Flex>
    </Container>
  )
}

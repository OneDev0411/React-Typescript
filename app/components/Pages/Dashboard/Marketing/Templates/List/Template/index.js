import React from 'react'
import Flex from 'styled-flex-component'

import Button from 'components/Button/ActionButton'

import { Container } from './styled'

export function Template(props) {
  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <img
        src={`${props.template.url}/thumbnail.png`}
        alt={props.template.template_type}
      />
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

import React from 'react'
import Flex from 'styled-flex-component'

import ThunderboltIcon from 'components/SvgIcons/Thunderbolt/ThunderboltIcon'

import { Container } from './styled'

export function DefaultView() {
  return (
    <Container center>
      <Flex center column>
        <ThunderboltIcon style={{ fill: '#7f7f7f', marginBottom: '1em' }} />
        <div>Select a Flow from the left list.</div>
      </Flex>
    </Container>
  )
}

import React from 'react'
import Flex from 'styled-flex-component'

import { grey } from 'views/utils/colors'
import ThunderboltIcon from 'components/SvgIcons/Thunderbolt/ThunderboltIcon'

import { Container } from './styled'

export default function DefaultView() {
  return (
    <Container center>
      <Flex center column>
        <ThunderboltIcon style={{ fill: grey.A900, marginBottom: '1em' }} />
        <div>Select a Flow from the left list.</div>
      </Flex>
    </Container>
  )
}

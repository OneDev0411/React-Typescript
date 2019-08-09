import React from 'react'
import Flex from 'styled-flex-component'

import { green } from 'views/utils/colors'

import ThunderboltIcon from 'components/SvgIcons/Thunderbolt/ThunderboltIcon'

import { Container } from './styled'

export default function ActiveMode() {
  return (
    <Container center>
      <Flex center column>
        <ThunderboltIcon style={{ fill: green.A100, marginBottom: '1em' }} />
        <div>The contact already added to this flow!</div>
      </Flex>
    </Container>
  )
}

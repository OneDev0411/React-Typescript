import React from 'react'
import Flex from 'styled-flex-component'

import { grey, primary } from 'views/utils/colors'

import ALink from 'components/ALink'
import ThunderboltIcon from 'components/SvgIcons/Thunderbolt/ThunderboltIcon'

import { Container } from './styled'

export default function WithoutStep({ flowId }) {
  return (
    <Container center>
      <Flex center column>
        <ThunderboltIcon style={{ fill: grey.A900, marginBottom: '1em' }} />
        <div>This Flow has no steps yet!</div>
        <div>
          You can add some{' '}
          <ALink
            style={{ color: primary, fontWeight: 'bold' }}
            to={`/dashboard/account/flows/${flowId}`}
          >
            here
          </ALink>
          .
        </div>
      </Flex>
    </Container>
  )
}

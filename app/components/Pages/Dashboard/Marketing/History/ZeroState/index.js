import React from 'react'
import Flex from 'styled-flex-component'

import { H2 } from 'components/Typography/headings'

import Icon from './Icon/Icon'

export function ZeroState() {
  return (
    <Flex center column style={{ height: '100vh' }}>
      <Icon style={{ marginBottom: '1.5rem' }} />
      <H2 style={{ marginBottom: '1rem' }}>You Have No Designs</H2>
      <div style={{ color: '#7f7f7f', textAlign: 'center', maxWidth: '27rem' }}>
        It looks like you haven’t created any social designs. Use the Marketing
        Center to send emails and post engaging content to Facebook & Instagram.
      </div>
    </Flex>
  )
}

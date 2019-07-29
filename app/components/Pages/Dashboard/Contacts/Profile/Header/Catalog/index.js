import React from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { H1 } from 'components/Typography/headings'
import { barlowFamilyStyle } from 'components/Typography/styles'

import Avatar from './Avatar'
import { LastTouched } from './LastTouched'

const Title = styled(H1)`
  position: relative;
  line-height: 1.5;

  > a {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    font-size: 0.875rem;
    font-family: ${barlowFamilyStyle};
  }
`

export function Catalog(props) {
  const { contact } = props

  return (
    <Flex>
      <Avatar contact={contact} />
      <Flex column style={{ padding: '0.5em 1.5em' }}>
        <Title>
          {contact.display_name}
          <a href="#Details">Edit</a>
        </Title>
        <LastTouched contact={contact} />
      </Flex>
    </Flex>
  )
}

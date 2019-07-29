import React from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { H1 } from 'components/Typography/headings'

import Avatar from './Avatar'
import { LastTouched } from './LastTouched'

const Title = styled(H1)`
  line-height: 1.5;
  display: inline-flex;
  align-items: baseline;

  > a {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    font-family: ${props => props.theme.typography.fontFamily};
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

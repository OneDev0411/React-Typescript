import React from 'react'
import Flex from 'styled-flex-component'

import { H1 } from '../../../../../../../views/components/Typography/headings'

import Avatar from './Avatar'
import { LastTouched } from './LastTouched'

export function Catalog(props) {
  const { contact } = props.contact

  console.log(contact)

  return (
    <Flex>
      <Avatar contact={contact} />
      <Flex>
        <H1>{contact.display_name}</H1>
        <LastTouched contact={contact} />
      </Flex>
    </Flex>
  )
}

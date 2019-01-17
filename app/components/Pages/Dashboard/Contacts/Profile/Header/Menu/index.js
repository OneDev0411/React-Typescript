import React from 'react'
import idx from 'idx'
import Flex from 'styled-flex-component'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import { CloseButton } from 'components/Button/CloseButton'

import Chat from './ChatButton'
import { Divider } from './Divider'

export function Menu(props) {
  const { contact } = props

  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      {idx(contact, c => c.summary.email) && (
        <SendContactCard contact={contact}>Send a Card</SendContactCard>
      )}
      <Chat contact={contact} />
      <Divider />
      <CloseButton isFit iconSize="large" inverse />
    </Flex>
  )
}

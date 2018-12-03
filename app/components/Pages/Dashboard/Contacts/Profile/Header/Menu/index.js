import React from 'react'
import Flex from 'styled-flex-component'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import Chat from './ChatButton'
import { Divider } from './Divider'
import { CloseButton } from '../../../../../../../views/components/Button/CloseButton'

export function Menu(props) {
  const { contact } = props

  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      <SendContactCard contact={contact}>Send a Card</SendContactCard>
      <Chat contact={contact} />
      <Divider />
      <CloseButton isFit iconSize="large" inverse />
    </Flex>
  )
}

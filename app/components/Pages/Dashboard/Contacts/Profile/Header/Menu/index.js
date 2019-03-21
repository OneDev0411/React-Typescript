import React from 'react'
import Flex from 'styled-flex-component'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import SendEmailButton from 'components/SendEmailButton'

import { CloseButton } from 'components/Button/CloseButton'

import Chat from './ChatButton'
import { Divider } from './Divider'

export function Menu(props) {
  const { contact } = props

  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      <SendContactCard contact={contact}>Send a Card</SendContactCard>
      <SendEmailButton style={{ marginLeft: '1rem' }} />
      <Chat contact={contact} />
      <Divider />
      <CloseButton
        isFit
        iconSize="large"
        inverse
        backUrl="/dashboard/contacts"
      />
    </Flex>
  )
}

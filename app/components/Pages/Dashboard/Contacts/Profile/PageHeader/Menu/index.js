import React from 'react'
import Flex from 'styled-flex-component'

import Chat from './ChatButton'
import { Divider } from './Divider'
import { CloseButton } from '../../../../../../../views/components/Button/CloseButton'
import Stage from '../../../../../../../views/components/ContactStage'

export function Menu(props) {
  const { contact } = props

  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      <Stage contacts={[contact.id]} style={{ marginRight: '0.5em' }} />
      <Chat contact={contact} />
      <Divider />
      <CloseButton isFit iconSize="large" inverse />
    </Flex>
  )
}

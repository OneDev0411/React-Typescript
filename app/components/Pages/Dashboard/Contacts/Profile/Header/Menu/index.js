import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import { AddToFlow } from 'components/AddToFlow'

import { CloseButton } from 'components/Button/CloseButton'

import Chat from './ChatButton'
import { Divider } from './Divider'

Menu.propTypes = {
  contact: PropTypes.shape().isRequired,
  addToFlowCallback: PropTypes.func
}

Menu.defaultProps = {
  addToFlowCallback() {}
}

export function Menu(props) {
  const { contact } = props

  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      <AddToFlow
        associations={{ contacts: [contact.id] }}
        callback={props.addToFlowCallback}
      />
      <SendContactCard contact={contact}>Send a Card</SendContactCard>
      <Chat contact={contact} />
      <Divider />
      <CloseButton isFit iconSize="large" inverse />
    </Flex>
  )
}

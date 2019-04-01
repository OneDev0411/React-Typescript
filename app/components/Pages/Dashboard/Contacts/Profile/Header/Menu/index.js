import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import { normalizeContact } from 'models/email-compose/helpers/normalize-contact'

import SendEmailButton from 'components/SendEmailButton'

import { CloseButton } from 'components/Button/CloseButton'

import Chat from './ChatButton'
import { Divider } from './Divider'

function Menu(props) {
  const { contact } = props

  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      <SendContactCard contact={contact}>Send a Card</SendContactCard>
      <SendEmailButton
        recipients={normalizeContact(contact, props.attributeDefs)}
        style={{ marginLeft: '1rem' }}
      />

      <Chat contact={contact} />
      <Divider />

      <CloseButton
        isFit
        iconSize="large"
        inverse
        // backUrl="/dashboard/contacts"
      />
    </Flex>
  )
}

function mapStateToProps({ contacts }) {
  return {
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(Menu)

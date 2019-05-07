import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import SendEmailButton from 'components/SendEmailButton'
import { CloseButton } from 'components/Button/CloseButton'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import normalizeContactForEmailCompose from 'models/email-compose/helpers/normalize-contact'

import Chat from './ChatButton'
import { Divider } from './Divider'

function Menu(props) {
  const { contact, closeButtonQuery, backUrl } = props

  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      <SendContactCard contact={contact}>Send a Card</SendContactCard>
      <SendEmailButton
        recipients={normalizeContactForEmailCompose(
          contact,
          props.attributeDefs
        )}
        style={{ marginLeft: '1rem' }}
      />

      <Chat contact={contact} />
      <Divider />

      <CloseButton
        isFit
        iconSize="large"
        inverse
        defaultBackUrl="/dashboard/contacts"
        backUrl={backUrl}
        query={closeButtonQuery}
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

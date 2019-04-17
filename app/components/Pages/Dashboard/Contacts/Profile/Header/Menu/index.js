import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import { AddToFlow } from 'components/AddToFlow'

import { normalizeContact } from 'models/email-compose/helpers/normalize-contact'

import SendEmailButton from 'components/SendEmailButton'

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

function Menu(props) {
  const { contact } = props

  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      <AddToFlow
        associations={{ contacts: [contact.id] }}
        callback={props.addToFlowCallback}
      />

      <SendEmailButton
        recipients={normalizeContact(contact, props.attributeDefs)}
        style={{ marginLeft: '1rem' }}
      />

      <SendContactCard
        contact={contact}
        buttonStyle={{ style: { marginLeft: '1rem' } }}
      >
        Send a Card
      </SendContactCard>

      <Chat contact={contact} />
      <Divider />

      <CloseButton
        isFit
        iconSize="large"
        inverse
        defaultBackUrl="/dashboard/contacts"
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

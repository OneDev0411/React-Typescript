import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import AddToFlowButton from 'components/AddToFlowButton'
import SendEmailButton from 'components/SendEmailButton'
import { CloseButton } from 'components/Button/CloseButton'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import normalizeContactForEmailCompose from 'models/email-compose/helpers/normalize-contact'

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
  const { contact, closeButtonQuery, backUrl } = props
  let { flows } = contact

  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      <AddToFlowButton
        activeFlows={Array.isArray(flows) ? flows.map(f => f.origin_id) : []}
        callback={props.addToFlowCallback}
        contacts={{
          ids: [contact.id]
        }}
      />

      <SendEmailButton
        recipients={normalizeContactForEmailCompose(
          contact,
          props.attributeDefs
        )}
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

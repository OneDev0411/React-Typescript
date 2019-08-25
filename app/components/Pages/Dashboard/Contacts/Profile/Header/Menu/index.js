import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import AddToFlowButton from 'components/AddToFlowButton'
import SendEmailButton from 'components/SendEmailButton'
import { CloseButton } from 'components/Button/CloseButton'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import { normalizeContactForEmailCompose } from 'models/email/helpers/normalize-contact'

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
        recipients={normalizeContactForEmailCompose(contact)}
        style={{ marginLeft: '1rem' }}
      />

      <SendContactCard
        contact={contact}
        mediums="Email"
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

export default Menu

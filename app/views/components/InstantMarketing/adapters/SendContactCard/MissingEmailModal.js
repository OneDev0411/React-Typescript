import React from 'react'

import { withRouter } from 'react-router'

import Button from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import BareModal from 'components/BareModal'

function MissingEmailModal({ contact, isOpen, onClose, ...props }) {
  return (
    <BareModal isOpen={isOpen} onRequestClose={onClose} padding autoHeight>
      <div>
        You should provide an email address for this contact to be able to send
        a card
      </div>
      <br />
      <div style={{ textAlign: 'center' }}>
        <Button onClick={onClose}>Okay</Button>
        &nbsp;&nbsp;
        {contact && !isContactPagePath(props.location.pathname, contact) && (
          <LinkButton
            onClick={onClose}
            target="_blank"
            to={`/dashboard/contacts/${contact.id}`}
            appearance="outline"
          >
            Edit Contact
          </LinkButton>
        )}
      </div>
    </BareModal>
  )
}

export default withRouter(MissingEmailModal)

function isContactPagePath(pathname, contact) {
  return pathname.indexOf(`/dashboard/contacts/${contact.id}`) === 0
}

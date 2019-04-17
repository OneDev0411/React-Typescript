import React from 'react'
import styled from 'styled-components'

import { withRouter } from 'react-router'

import Button from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import BareModal from 'components/BareModal'

const ModalContant = styled.div`
  font-size: 1.7em;
  text-align: center;
  p {
    margin-bottom: 2em;
  }
  button {
    margin: 1em;
  }
`

function MissingEmailModal({ contact, isOpen, onClose, ...props }) {
  return (
    <BareModal
      isOpen={isOpen}
      onRequestClose={onClose}
      hasDefaultPadding
      autoHeight
    >
      <ModalContant>
        <p>
          You should provide an email address for this contact to be able to
          send a card
        </p>
        <Button onClick={onClose}>Okay</Button>
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
      </ModalContant>
    </BareModal>
  )
}

export default withRouter(MissingEmailModal)

function isContactPagePath(pathname, contact) {
  return pathname.indexOf(`/dashboard/contacts/${contact.id}`) === 0
}

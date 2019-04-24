import React from 'react'
import styled from 'styled-components'

import { withRouter } from 'react-router'

import Button from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import BareModal from 'components/BareModal'

const ModalContant = styled.div`
  font-size: 1.7rem;
  padding: 2.5rem;
  text-align: center;
  p {
    margin-bottom: 2rem;
  }
  button {
    margin-right: 1rem;
  }
`

function MissingEmailModal({ contact, isOpen, onClose, ...props }) {
  return (
    <BareModal isOpen={isOpen} onRequestClose={onClose} autoHeight>
      <ModalContant>
        <p>
          You should provide an email address for this contact to be able to
          send a card.
        </p>
        <Button onClick={onClose} appearance="outline">Cancel</Button>
        {contact && !isContactPagePath(props.location.pathname, contact) && (
          <LinkButton
            appearance="primary"
            onClick={onClose}
            target="_blank"
            to={`/dashboard/contacts/${contact.id}`}
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

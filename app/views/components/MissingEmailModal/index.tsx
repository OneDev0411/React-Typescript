import React from 'react'
import styled from 'styled-components'

import { withRouter, WithRouterProps } from 'react-router'

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

interface Props {
  contactId?: UUID
  isOpen: boolean
  action: string
  onClose: () => void
}

function MissingEmailModal({
  contactId,
  isOpen,
  onClose,
  action,
  location
}: Props & WithRouterProps) {
  return (
    <BareModal isOpen={isOpen} onRequestClose={onClose} autoHeight>
      <ModalContant>
        <p>
          You should provide an email address for this contact to be able to{' '}
          {action}.
        </p>
        <Button onClick={onClose} appearance="outline">
          Cancel
        </Button>
        {contactId && !isContactPagePath(location.pathname, contactId) && (
          <LinkButton
            appearance="primary"
            onClick={onClose}
            target="_blank"
            to={`/dashboard/contacts/${contactId}`}
          >
            Edit Contact
          </LinkButton>
        )}
      </ModalContant>
    </BareModal>
  )
}

export default withRouter(MissingEmailModal)

function isContactPagePath(path: string, contactId: UUID) {
  return path.indexOf(`/dashboard/contacts/${contactId}`) === 0
}

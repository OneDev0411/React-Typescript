import React from 'react'
import { withRouter, WithRouterProps } from 'react-router'
import { Typography, Button } from '@material-ui/core'

import Link from 'components/ALink'
import BareModal from 'components/BareModal'

import { ModalContent, ButtonsContainer } from './styled'

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
      <ModalContent>
        <Typography variant="body1" style={{ marginBottom: '2rem' }}>
          You should provide an email address for this contact to be able to{' '}
          {action}.
        </Typography>
        <ButtonsContainer>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          {contactId && !isContactPagePath(location.pathname, contactId) && (
            <Link
              noStyle
              target="_blank"
              to={`/dashboard/contacts/${contactId}`}
            >
              <Button onClick={onClose} variant="contained" color="primary">
                Edit Contact
              </Button>
            </Link>
          )}
        </ButtonsContainer>
      </ModalContent>
    </BareModal>
  )
}

export default withRouter(MissingEmailModal)

function isContactPagePath(path: string, contactId: UUID) {
  return path.indexOf(`/dashboard/contacts/${contactId}`) === 0
}

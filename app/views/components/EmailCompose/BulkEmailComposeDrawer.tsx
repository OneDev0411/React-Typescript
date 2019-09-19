import React, { ComponentProps } from 'react'

import { BulkEmailComposeForm } from './BulkEmailComposeForm'
import OverlayDrawer from '../OverlayDrawer'

interface Props extends ComponentProps<typeof BulkEmailComposeForm> {
  isOpen: boolean
  onClose?: () => void

  getEmail?: (
    values: IIndividualEmailCampaignInput
  ) => IIndividualEmailCampaignInput
  emailId?: string
  disableAddNewRecipient?: boolean
}

export function BulkEmailComposeDrawer({
  getEmail = email => email,
  disableAddNewRecipient = false,
  emailId,
  isOpen,
  onClose = () => {},
  ...otherProps
}: Props) {
  return (
    <OverlayDrawer open={isOpen} onClose={onClose}>
      <OverlayDrawer.Header title={emailId ? 'Edit Email' : 'New Email'} />
      <OverlayDrawer.Body>
        <BulkEmailComposeForm {...otherProps} />
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

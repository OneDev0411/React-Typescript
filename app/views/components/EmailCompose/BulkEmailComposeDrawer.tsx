import React, { ComponentProps } from 'react'

import OverlayDrawer from '../OverlayDrawer'

import { BulkEmailComposeForm } from './BulkEmailComposeForm'

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
  emailId,
  isOpen,
  onClose = () => {},
  ...otherProps
}: Props) {
  return (
    <OverlayDrawer open={isOpen} onClose={onClose} width="43rem">
      <OverlayDrawer.Header title={emailId ? 'Edit Email' : 'New Email'} />
      <BulkEmailComposeForm {...otherProps} emailId={emailId} />
    </OverlayDrawer>
  )
}

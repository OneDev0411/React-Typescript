import React, { ComponentProps } from 'react'

import OverlayDrawer from '../OverlayDrawer'
import { SingleEmailComposeForm } from './SingleEmailComposeForm'

interface Props extends ComponentProps<typeof SingleEmailComposeForm> {
  isOpen: boolean
  onClose?: () => void
  onClickAddDealAttachments?: () => void

  getEmail?: (values: IEmailCampaignInput) => IEmailCampaignInput
  disableAddNewRecipient?: boolean
  /**
   * If set, it's used to update an already existing scheduled/draft email
   */
  emailId?: string
}

export function SingleEmailComposeDrawer({
  emailId,
  isOpen,
  onClose = () => {},
  onClickAddDealAttachments = () => {},
  ...otherProps
}: Props) {
  return (
    <OverlayDrawer open={isOpen} onClose={onClose} width="43rem">
      <OverlayDrawer.Header title={emailId ? 'Edit Email' : 'New Email'} />
      <SingleEmailComposeForm
        {...otherProps}
        emailId={emailId}
        onClickAddDealAttachments={onClickAddDealAttachments}
      />
    </OverlayDrawer>
  )
}

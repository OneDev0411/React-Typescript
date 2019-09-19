import React, { ComponentProps } from 'react'

import OverlayDrawer from '../OverlayDrawer'
import { SingleEmailComposeForm } from './SingleEmailComposeForm'

interface Props extends ComponentProps<typeof SingleEmailComposeForm> {
  isOpen: boolean
  onClose?: () => void

  getEmail?: (values: IEmailCampaignInput) => IEmailCampaignInput
  disableAddNewRecipient?: boolean
  /**
   * If set, it's used to update an already existing scheduled/draft email
   */
  emailId?: string
}

export function SingleEmailComposeDrawer({
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
        <SingleEmailComposeForm {...otherProps} />
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

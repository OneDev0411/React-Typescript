import React, { ComponentProps, useState } from 'react'

import EmailFollowUpModal from '../EmailFollowUpModal'
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
  const [email, setEmail] = useState<IEmailCampaign<
    IEmailCampaignAssociation,
    IEmailCampaignRecipientAssociation,
    IEmailCampaignEmailAssociation
  > | null>(null)
  const [followUpModalIsOpen, setFollowUpModalIsOpen] = useState(false)

  const onSent = result => {
    addFollowUp(result.data)
  }

  const addFollowUp = email => {
    setEmail(email)
    setFollowUpModalIsOpen(true)
  }

  const onCloseEmailFollowUpModal = () => {
    setFollowUpModalIsOpen(false)
    onClose()

    if (otherProps?.onSent) {
      otherProps.onSent(email)
    }
  }

  return (
    <>
      <OverlayDrawer open={isOpen} onClose={onClose} width="43rem">
        <OverlayDrawer.Header title={emailId ? 'Edit Email' : 'New Email'} />
        <SingleEmailComposeForm
          {...otherProps}
          emailId={emailId}
          onClose={onClose}
          onSent={onSent}
          onClickAddDealAttachments={onClickAddDealAttachments}
        />
      </OverlayDrawer>
      <EmailFollowUpModal
        email={email}
        isOpen={followUpModalIsOpen}
        onClose={onCloseEmailFollowUpModal}
      />
    </>
  )
}

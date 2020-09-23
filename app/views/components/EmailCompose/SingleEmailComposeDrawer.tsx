import React, { ComponentProps, useState } from 'react'

import { noop } from 'utils/helpers'

import FollowUpModal from '../FollowUpModal'
import OverlayDrawer from '../OverlayDrawer'
import { SingleEmailComposeForm } from './SingleEmailComposeForm'

interface Props extends ComponentProps<typeof SingleEmailComposeForm> {
  isOpen: boolean
  onClose?: () => void
  onClickAddDealAttachments?: () => void
  followUpCallback?: (event: IEvent) => void

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
  onClose = noop,
  followUpCallback = noop,
  onClickAddDealAttachments = noop,
  ...otherProps
}: Props) {
  const [email, setEmail] = useState<IEmailCampaign<
    IEmailCampaignAssociation,
    IEmailCampaignRecipientAssociation,
    IEmailCampaignEmailAssociation
  > | null>(null)
  const [followUpModalIsOpen, setFollowUpModalIsOpen] = useState(false)

  const onSent = result => {
    const email = result.data

    if (email.individual) {
      onClose()
    } else {
      addFollowUp(email)
    }
  }

  const addFollowUp = email => {
    setEmail(email)
    setFollowUpModalIsOpen(true)
  }

  const onCloseFollowUpModal = () => {
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
      <FollowUpModal
        email={email}
        callback={followUpCallback}
        isOpen={followUpModalIsOpen}
        onClose={onCloseFollowUpModal}
      />
    </>
  )
}

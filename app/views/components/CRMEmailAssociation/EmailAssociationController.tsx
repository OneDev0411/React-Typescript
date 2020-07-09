import React from 'react'

import {
  EmailCampaignThreadByCampaignId,
  EmailThreadDrawerByThreadKey
} from '../EmailThreadDrawer'

interface Props {
  contact?: IContact
  onClose: () => void
  email: any
}

export function EmailAssociationController({ email, contact, onClose }: Props) {
  if (email.type === 'email_campaign') {
    return (
      <EmailCampaignThreadByCampaignId
        open
        onClose={onClose}
        contactId={contact && contact.id}
        campaignId={email.id || undefined}
      />
    )
  }

  if (['email', 'google_message', 'microsoft_message'].includes(email.type)) {
    return (
      <EmailThreadDrawerByThreadKey
        open
        onClose={onClose}
        threadKey={email.thread_key}
        hideBottomButtons
      />
    )
  }

  return null
}

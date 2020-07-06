import React from 'react'

import { EmailCampaignThreadByCampaignId } from '../EmailThreadDrawer'

interface Props {
  contact?: IContact
  onClose: () => void
  email: any
}

export function EmailAssociationController({ email, contact, onClose }: Props) {
  return (
    <EmailCampaignThreadByCampaignId
      open={!!(email.type === 'email_campaign')}
      onClose={onClose}
      contactId={contact && contact.id}
      campaignId={email.id || undefined}
    />
  )
}

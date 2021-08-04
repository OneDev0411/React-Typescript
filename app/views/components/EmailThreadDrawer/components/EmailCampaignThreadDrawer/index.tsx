import React from 'react'

import { getEmailCampaignEmail } from 'models/email/helpers/get-email-campaign-email'

import { EmailThread } from '../../../EmailThread'
import { DrawerProps } from '../../../OverlayDrawer'
import { Drawer } from '../Drawer'

interface Props extends DrawerProps {
  campaign: IEmailCampaign<
    'emails' | 'attachments',
    any,
    'email',
    'html' | 'text'
  >
}

/**
 * A drawer for showing an email thread UI for an email campaign.
 */
export function EmailCampaignThreadDrawer({ campaign, ...drawerProps }: Props) {
  const email = getEmailCampaignEmail(campaign)

  return (
    <Drawer {...drawerProps}>
      {drawerProps.open && (
        <EmailThread
          messages={email ? [email] : []}
          subject={(email && email.subject) || ''}
          onClose={drawerProps.onClose}
        />
      )}
    </Drawer>
  )
}

import React from 'react'

import { Drawer } from '../Drawer'
import { EmailThread } from '../../../EmailThread'
import { DrawerProps } from '../../../OverlayDrawer'

interface Props extends DrawerProps {
  campaign: IEmailCampaign<'emails', any, 'email'>
}

/**
 * A drawer for showing an email thread UI for an email campaign.
 */
export function EmailCampaignThreadDrawer({ campaign, ...drawerProps }: Props) {
  const emailCampaignEmail = campaign.emails && campaign.emails[0]
  const email = emailCampaignEmail && emailCampaignEmail.email

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

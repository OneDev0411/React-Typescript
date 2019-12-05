import React, { useMemo } from 'react'

import { emailCampaignToThread } from 'models/email/helpers/email-campaign-to-thread'

import { Drawer } from '../Drawer'
import { EmailThread } from '../../../EmailThread'
import { DrawerProps } from '../../../OverlayDrawer'

interface Props extends DrawerProps {
  campaign: IEmailCampaign<
    IEmailCampaignAssociation,
    IEmailCampaignRecipientAssociation
  >
}

/**
 * A drawer for showing an email thread UI for an email campaign.
 */
export function EmailCampaignThreadDrawer({ campaign, ...drawerProps }: Props) {
  const thread = useMemo(() => emailCampaignToThread(campaign), [campaign])

  return (
    <Drawer {...drawerProps}>
      {drawerProps.open && (
        <EmailThread
          messages={thread.messages}
          subject={thread.subject}
          onClose={drawerProps.onClose}
        />
      )}
    </Drawer>
  )
}

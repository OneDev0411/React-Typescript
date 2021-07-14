import React from 'react'

import { Button } from '@material-ui/core'

import { AsyncValueContainer } from '../../../AsyncValueContainer'
import { EmailThread } from '../../../EmailThread'
import { useEmailCampaignThreadLoader } from '../../../EmailThread/use-email-campaign-thread-loader'
import { DrawerProps } from '../../../OverlayDrawer'
import { Drawer } from '../Drawer'

interface Props extends DrawerProps {
  campaignId: string | undefined
  contactId: string | undefined
}

/**
 * A drawer for loading an email campaign by it's id and showing email thread
 * UI for it.
 */
export function EmailCampaignThreadByCampaignId({
  campaignId,
  contactId,
  ...drawerProps
}: Props) {
  const { fetchThread, thread, loading, error } = useEmailCampaignThreadLoader(
    campaignId,
    contactId
  )

  return (
    <Drawer {...drawerProps}>
      {drawerProps.open && campaignId && (
        <AsyncValueContainer
          loading={loading}
          error={error}
          onRetry={fetchThread}
          errorChildren={
            <Button
              variant="outlined"
              onClick={e => drawerProps.onClose(e, 'closeButtonClick')}
            >
              Close
            </Button>
          }
        >
          {thread && (
            <EmailThread
              messages={thread.messages}
              subject={thread.subject}
              onClose={drawerProps.onClose}
            />
          )}
        </AsyncValueContainer>
      )}
    </Drawer>
  )
}

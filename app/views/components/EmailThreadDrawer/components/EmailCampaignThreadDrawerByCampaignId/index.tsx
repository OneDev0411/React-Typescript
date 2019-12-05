import React from 'react'

import { Button } from '@material-ui/core'

import { Drawer } from '../Drawer'
import { AsyncValueContainer } from '../../../AsyncValueContainer'
import { EmailThread } from '../../../EmailThread'
import { DrawerProps } from '../../../OverlayDrawer'
import { useEmailCampaignThreadLoader } from '../../../EmailThread/use-email-campaign-thread-loader'

interface Props extends DrawerProps {
  campaignId: string | undefined
}

/**
 * A drawer for loading an email campaign by it's id and showing email thread
 * UI for it.
 */
export function EmailCampaignThreadByCampaignId({
  campaignId,
  ...drawerProps
}: Props) {
  const { fetchThread, thread, loading, error } = useEmailCampaignThreadLoader(
    campaignId
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

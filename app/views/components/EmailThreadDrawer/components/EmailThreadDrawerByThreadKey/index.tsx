import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Button } from '@material-ui/core'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { markThreadAsRead } from 'components/EmailThread/helpers/mark-thread-as-read'

import { hasOAuthAccess } from 'components/EmailThread/helpers/has-oauth-access'

import { useEmailThreadLoader } from '../../../EmailThread/use-email-thread-loader'
import { Drawer } from '../Drawer'
import { AsyncValueContainer } from '../../../AsyncValueContainer'
import { EmailThread } from '../../../EmailThread'
import { DrawerProps } from '../../../OverlayDrawer'

interface Props extends DrawerProps {
  /**
   * thread key is credential_id + thread_id
   */
  threadKey: string | undefined
}

/**
 * A drawer for loading an email thead by it's key and showing it
 */
export function EmailThreadDrawerByThreadKey({
  threadKey,
  ...drawerProps
}: Props) {
  const { fetchThread, thread, loading, error } = useEmailThreadLoader(
    threadKey
  )
  const accounts: IOAuthAccount[] = useSelector((state: IAppState) =>
    selectAllConnectedAccounts(state.contacts.oAuthAccounts)
  )

  useEffect(() => {
    if (
      thread &&
      !loading &&
      hasOAuthAccess(
        accounts,
        thread.google_credential || thread.microsoft_credential,
        'mail.modify'
      )
    ) {
      markThreadAsRead(thread)
    }
  }, [accounts, loading, thread])

  return (
    <Drawer {...drawerProps}>
      {drawerProps.open && threadKey && (
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

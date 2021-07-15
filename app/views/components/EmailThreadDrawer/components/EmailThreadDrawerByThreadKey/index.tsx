import React, { useEffect, useMemo, useState } from 'react'

import { Button } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { hasOAuthAccess } from 'components/EmailThread/helpers/has-oauth-access'
import { setEmailThreadsReadStatus } from 'models/email/set-email-threads-read-status'
import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { AsyncValueContainer } from '../../../AsyncValueContainer'
import { EmailThread } from '../../../EmailThread'
import { useEmailThreadLoader } from '../../../EmailThread/use-email-thread-loader'
import { DrawerProps } from '../../../OverlayDrawer'
import { Drawer } from '../Drawer'

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
  const { fetchThread, thread, loading, error } =
    useEmailThreadLoader(threadKey)
  const [markedAsReadThreadId, setMarkAsReadThreadId] = useState<
    UUID | undefined
  >(undefined)
  const accounts: IOAuthAccount[] = useSelector((state: IAppState) =>
    selectAllConnectedAccounts(state.contacts.oAuthAccounts)
  )
  const hasAccessToModifyMail = useMemo(
    () =>
      thread &&
      hasOAuthAccess(
        accounts,
        thread.google_credential || thread.microsoft_credential,
        'mail.modify'
      ),
    [thread, accounts]
  )

  useEffect(() => {
    if (
      thread &&
      thread.id === threadKey &&
      !loading &&
      !thread.is_read &&
      markedAsReadThreadId !== threadKey &&
      hasAccessToModifyMail
    ) {
      setMarkAsReadThreadId(threadKey)
      setEmailThreadsReadStatus([thread.id], true).catch(reason => {
        console.error(reason)
        setMarkAsReadThreadId(undefined)
      })
    }
  }, [threadKey, thread, loading, hasAccessToModifyMail, markedAsReadThreadId])

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

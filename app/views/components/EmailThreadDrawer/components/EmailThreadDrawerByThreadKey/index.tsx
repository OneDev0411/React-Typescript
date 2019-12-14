import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { Button } from '@material-ui/core'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { markThreadAsRead } from 'components/EmailThread/helpers/mark-thread-as-read'

import { canUpdateThreadReadStatus } from 'components/EmailThread/helpers/can-update-thread-read-status'

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

interface StateProps {
  accounts: IOAuthAccount[]
}

/**
 * A drawer for loading an email thead by it's key and showing it
 */
function EmailThreadDrawerByThreadKey({
  threadKey,
  accounts,
  ...drawerProps
}: Props & StateProps) {
  const { fetchThread, thread, loading, error } = useEmailThreadLoader(
    threadKey
  )

  useEffect(() => {
    if (thread && !loading && canUpdateThreadReadStatus(accounts, thread)) {
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

function mapStateToProps(state: IAppState) {
  return {
    accounts: selectAllConnectedAccounts(state.contacts.oAuthAccounts)
  }
}

export default connect(mapStateToProps)(EmailThreadDrawerByThreadKey)

import * as React from 'react'

import { Theme, Tooltip } from '@material-ui/core'

import styled, { ThemeProps } from 'styled-components'

import IconWarning from 'components/SvgIcons/Warning/IconWarning'

import { RelativeTime } from '../RelativeTime'

type SyncType = 'contacts' | 'emails'

interface Props {
  account: IOAuthAccount
  syncType?: SyncType
}

const WarningIcon = styled(IconWarning).attrs({
  size: { width: 16, height: 16 }
})`
  vertical-align: text-top;
  margin: ${({ theme }: ThemeProps<Theme>) => theme.spacing(0, 1)};
` as typeof IconWarning

export function ConnectedAccountSyncStatus(props: Props) {
  const lastSync = getLastSync(props.account, props.syncType)
  const syncError = getSyncError(props.account)

  return (
    <>
      Synced <RelativeTime time={lastSync} />
      {syncError && (
        <Tooltip title={syncError}>
          <WarningIcon />
        </Tooltip>
      )}
    </>
  )
}

function getLastSync(account: IOAuthAccount, syncType?: SyncType) {
  switch (syncType) {
    case 'contacts':
      return account.contacts_last_sync_at
    default:
      return account.last_sync_at
  }
}

function getSyncError(account: IOAuthAccount): string | null {
  const latestSync = (account.histories || [])[0]

  return (latestSync && latestSync.extract_contacts_error) || null
}

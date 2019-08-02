import { OAuthProvider } from 'constants/contacts'

import { Link } from '@material-ui/core'

import * as React from 'react'

import { oAuthAccountTypeToProvider } from './consants'

interface Props {
  account: IOAuthAccount
  onSync: (provider: OAuthProvider, accountId: string) => Promise<void>
}

export function SyncButton({ account, onSync }: Props) {
  if (account.revoked) {
    return <>Revoked</>
  }

  if (!account.sync_status || account.sync_status === 'pending') {
    return <>Syncing ...</>
  }

  return (
    <Link
      component="button"
      onClick={() =>
        onSync(oAuthAccountTypeToProvider[account.type], account.id)
      }
    >
      Sync now
    </Link>
  )
}

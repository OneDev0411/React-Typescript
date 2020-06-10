import { Link } from '@material-ui/core'

import * as React from 'react'

import { OAuthProvider } from 'constants/contacts'

import { oAuthAccountTypeToProvider } from './constants'

interface Props {
  account: IOAuthAccount
  onSync: (provider: OAuthProvider, accountId: string) => Promise<void>
}

export function SyncButton({ account, onSync }: Props) {
  if (account.revoked) {
    return <>Revoked</>
  }

  if ((account.jobs || []).some(job => job.status !== 'success')) {
    return <>Syncing ...</>
  }

  return (
    <Link
      component="button"
      color="secondary"
      onClick={() =>
        onSync(oAuthAccountTypeToProvider[account.type], account.id)
      }
    >
      Sync now
    </Link>
  )
}

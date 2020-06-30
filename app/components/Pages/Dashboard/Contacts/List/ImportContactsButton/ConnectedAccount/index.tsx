import React from 'react'
import { mdiCogOutline } from '@mdi/js'
import { Box, Tooltip, IconButton } from '@material-ui/core'

import Avatar from 'components/Avatar'
import { ConnectedAccountSyncStatus } from 'components/ConnectedAccountSyncStatus'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { AccountInfoWrapper } from './styled'

interface Props {
  account: IOAuthAccount
}

export function ConnectedAccount({ account }: Props) {
  return (
    <AccountInfoWrapper>
      <div className="header">
        {/* @ts-ignore props are detected mandatory from js file */}
        <Avatar
          size={24}
          style={{ marginRight: '1rem' }}
          title={account.display_name}
          image={account.photo}
        />
        {account.email}
      </div>
      <div className="secondary">
        <ConnectedAccountSyncStatus account={account} />
        <Box flexGrow={1} />
        <Tooltip title="Settings" className="settings">
          <IconButton>
            <SvgIcon path={mdiCogOutline} />
          </IconButton>
        </Tooltip>
      </div>
    </AccountInfoWrapper>
  )
}

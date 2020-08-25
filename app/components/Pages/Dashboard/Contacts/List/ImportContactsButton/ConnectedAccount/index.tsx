import React from 'react'
import { mdiCogOutline } from '@mdi/js'
import { Box, Tooltip, IconButton } from '@material-ui/core'

import { ConnectedAccountSyncStatus } from 'components/ConnectedAccountSyncStatus'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { Avatar } from 'components/GeneralAvatar'

import { AccountInfoWrapper } from './styled'

interface Props {
  account: IOAuthAccount
}

export function ConnectedAccount({ account }: Props) {
  return (
    <AccountInfoWrapper>
      <div className="header">
        <Box marginRight="1rem">
          <Tooltip title={account.display_name}>
            <Avatar user={account} alt={account.display_name} size="small" />
          </Tooltip>
        </Box>
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

import React from 'react'
import { mdiCogOutline } from '@mdi/js'
import { Box, Tooltip, IconButton, Avatar, Theme } from '@material-ui/core'

import { makeStyles } from '@material-ui/styles'

import { ConnectedAccountSyncStatus } from 'components/ConnectedAccountSyncStatus'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { AccountInfoWrapper } from './styled'

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: '1rem'
  }
}))

interface Props {
  account: IOAuthAccount
}

export function ConnectedAccount({ account }: Props) {
  const classes = useStyles()

  return (
    <AccountInfoWrapper>
      <div className="header">
        <Box marginRight="1rem">
          <Tooltip title={account.display_name}>
            <Avatar
              alt={account.display_name}
              src={account.photo || undefined}
              className={classes.avatar}
            />
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

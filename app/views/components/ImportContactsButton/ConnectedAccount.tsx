import React from 'react'
import { mdiCogOutline } from '@mdi/js'
import { Grid, Tooltip, IconButton, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { ConnectedAccountSyncStatus } from 'components/ConnectedAccountSyncStatus'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { Avatar } from 'components/Avatar'

interface Props {
  account: IOAuthAccount
}

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    lineHeight: 1.5,
    minWidth: theme.spacing(30)
  },
  avatarWrapper: {
    marginRight: theme.spacing(2)
  },
  accountsButtonsWrapper: {
    paddingLeft: 46,
    display: 'inline-block',
    '& > button': {
      margin: theme.spacing(0, 0.5)
    }
  },
  settingsWrapper: {
    paddingLeft: theme.spacing(1),
    marginLeft: theme.spacing(1),
    display: 'inline-block',
    borderLeft: `1px solid ${theme.palette.grey[300]}`
  }
}))

export function ConnectedAccount({ account }: Props) {
  const classes = useStyles()

  return (
    <Grid className={classes.root}>
      <Grid container alignItems="center">
        <Grid className={classes.avatarWrapper}>
          <Tooltip title={account.display_name}>
            <Avatar user={account} alt={account.display_name} size="medium" />
          </Tooltip>
        </Grid>
        {account.email}
      </Grid>
      <Grid>
        <ConnectedAccountSyncStatus
          className={classes.accountsButtonsWrapper}
          size="small"
          account={account}
        />
        <div className={classes.settingsWrapper}>
          <Tooltip title="Settings" className="settings">
            <IconButton size="small">
              <SvgIcon path={mdiCogOutline} />
            </IconButton>
          </Tooltip>
        </div>
      </Grid>
    </Grid>
  )
}

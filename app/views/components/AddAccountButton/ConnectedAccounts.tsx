import { Fragment, useMemo } from 'react'

import { Divider, Link, MenuItem, Typography } from '@material-ui/core'
import { Link as RouterLink } from 'react-router'

import { useActiveBrandId } from '@app/hooks/brand'
import { useLeadChannels } from '@app/hooks/lead-channel'

import { ConnectedAccount } from './ConnectedAccount'
import { convertLeadChannelsToAuthAccounts } from './helper'
import { useStyles } from './styles'

export interface Props {
  accounts: IOAuthAccount[]
  onClickItems: () => void
}

export function ConnectedAccounts({ accounts, onClickItems }: Props) {
  const activeBrandId = useActiveBrandId()
  const { data: channels } = useLeadChannels(activeBrandId)
  const classes = useStyles()

  const accountsAndChannels = useMemo(
    () => [
      ...accounts,
      ...convertLeadChannelsToAuthAccounts(
        channels ? channels.filter(channel => channel.capture_number > 0) : []
      )
    ],
    [accounts, channels]
  )

  return (
    <div className={classes.connectedAccounts}>
      {accountsAndChannels.length > 0 && (
        <>
          <Divider />
          <Typography
            className={classes.accountsSectionTitle}
            variant="body2"
            color="textSecondary"
          >
            Connected Accounts
          </Typography>
        </>
      )}
      {accountsAndChannels.map((account, index) => (
        <Fragment key={account.id}>
          <MenuItem>
            <Link
              component={RouterLink}
              onClick={onClickItems}
              to="/dashboard/account/connected-accounts"
              color="inherit"
              underline="none"
              className={classes.fullWidth}
            >
              <ConnectedAccount account={account} />
            </Link>
          </MenuItem>
          {index !== accountsAndChannels.length - 1 && <Divider />}
        </Fragment>
      ))}
    </div>
  )
}

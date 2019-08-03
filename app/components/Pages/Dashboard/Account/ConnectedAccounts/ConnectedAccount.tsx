import { OAuthProvider } from 'constants/contacts'

import * as React from 'react'
import {
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Theme
} from '@material-ui/core'

import styled, { ThemeProps } from 'styled-components'

import Avatar from 'components/Avatar'
import { ConnectedAccountSyncStatus } from 'components/ConnectedAccountSyncStatus'

import { DangerButton } from 'components/Button/DangerButton'

import { oAuthAccountTypeToProvider, oAuthAccountTypeToTitle } from './consants'
import { SyncButton } from './SyncButton'

interface Props {
  account: IOAuthAccount
  onSync: (provider: OAuthProvider, accountId: string) => Promise<void>
  onDelete: (provider: OAuthProvider, accountId: string) => any
}

const ConnectedAccountListItem = styled(ListItem)`
  border-bottom: 1px solid
    ${({ theme }: ThemeProps<Theme>) => theme.palette.divider};
`

export function ConnectedAccount({ account, onSync, onDelete }: Props) {
  return (
    <ConnectedAccountListItem>
      <ListItemAvatar>
        <Avatar
          size={40}
          style={{ marginRight: '1rem' }}
          title={account.display_name}
          image={account.photo}
        />
      </ListItemAvatar>
      <Grid container>
        <Grid item xs={4}>
          <ListItemText
            primary={account.email}
            secondary={oAuthAccountTypeToTitle[account.type]}
          />
        </Grid>
        <Grid item xs={4}>
          <ListItemText
            primary={<ConnectedAccountSyncStatus account={account} />}
            secondary={<SyncButton account={account} onSync={onSync} />}
          />
        </Grid>
        <ListItemSecondaryAction>
          <DangerButton
            variant="outlined"
            size="small"
            onClick={() =>
              onDelete(oAuthAccountTypeToProvider[account.type], account.id)
            }
          >
            Disconnect Account
          </DangerButton>
        </ListItemSecondaryAction>
      </Grid>
    </ConnectedAccountListItem>
  )
}

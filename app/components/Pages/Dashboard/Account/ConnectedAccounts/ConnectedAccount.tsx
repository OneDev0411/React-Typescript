import * as React from 'react'
import {
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Theme
} from '@material-ui/core'
import styled, { ThemeProps } from 'styled-components'
import Flex from 'styled-flex-component'

import { useTheme } from '@material-ui/styles'

import { OAuthProvider } from 'constants/contacts'

import IconPermission from 'components/SvgIcons/Permission/IconPermission'

import Avatar from 'components/Avatar'
import { ConnectedAccountSyncStatus } from 'components/ConnectedAccountSyncStatus'
import { DangerButton } from 'components/Button/DangerButton'

import {
  oAuthAccountTypeToProvider,
  oAuthAccountTypeToTitle
} from './constants'

import { SyncButton } from './SyncButton'
import ConnectedCalendar from './ConnectedCalendar'

interface Props {
  account: IOAuthAccount
  onSync: (provider: OAuthProvider, accountId: string) => Promise<void>
  onDelete: (provider: OAuthProvider, accountId: string) => any
}

const ConnectedAccountListItem = styled(ListItem)`
  border-bottom: 1px solid
    ${({ theme }: ThemeProps<Theme>) => theme.palette.divider};
` as typeof ListItem

export default function ConnectedAccount({ account, onSync, onDelete }: Props) {
  const theme = useTheme<Theme>()

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
            secondary={
              <Flex alignCenter>
                <div style={{ marginRight: '0.5rem' }}>
                  {oAuthAccountTypeToTitle[account.type]}
                </div>

                <Tooltip
                  title={
                    <>
                      {account.scope_summary.map((name, index) => (
                        <div
                          key={index}
                          style={{
                            textTransform: 'capitalize'
                          }}
                        >
                          {name.split('.').join(' ')}
                        </div>
                      ))}
                    </>
                  }
                >
                  <IconPermission
                    size="small"
                    fillColor={theme.palette.grey[500]}
                  />
                </Tooltip>
              </Flex>
            }
          />
        </Grid>

        <Grid item xs={4}>
          <ListItemText
            primary={<ConnectedAccountSyncStatus account={account} />}
            secondary={<SyncButton account={account} onSync={onSync} />}
          />
        </Grid>

        <ListItemSecondaryAction>
          {oAuthAccountTypeToProvider[account.type] === 'google' &&
            account.scope_summary.includes('calendar') && (
              <ConnectedCalendar gcid={account.id} />
            )}

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

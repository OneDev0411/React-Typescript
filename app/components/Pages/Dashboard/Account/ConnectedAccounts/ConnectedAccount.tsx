import * as React from 'react'

import {
  Grid,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Theme
} from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import styled, { ThemeProps } from 'styled-components'
import Flex from 'styled-flex-component'

import { Avatar } from 'components/Avatar'
import { DangerButton } from 'components/Button/DangerButton'
import { ConnectedAccountSyncStatus } from 'components/ConnectedAccountSyncStatus'
import IconPermission from 'components/SvgIcons/Permission/IconPermission'
import { OAuthProvider } from 'constants/contacts'
import { getContactNameInitials } from 'models/contacts/helpers'

import {
  oAuthAccountTypeToProvider,
  oAuthAccountTypeToTitle
} from './constants'
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

export default function ConnectedAccount({ account, onSync, onDelete }: Props) {
  const theme = useTheme<Theme>()

  return (
    <ConnectedAccountListItem button>
      <ListItemAvatar>
        <Avatar user={account} style={{ marginRight: '1rem' }}>
          {getContactNameInitials(account)}
        </Avatar>
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

        <Grid item xs={6} direction="row" alignItems="center">
          <Box display="flex" alignItems="center">
            <ConnectedAccountSyncStatus account={account} />
            <SyncButton account={account} onSync={onSync} />
          </Box>
        </Grid>

        <ListItemSecondaryAction>
          {/* {oAuthAccountTypeToProvider[account.type] === 'google' &&
            account.scope_summary.includes('calendar') && (
              <ConnectedCalendar gcid={account.id} />
            )} */}

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

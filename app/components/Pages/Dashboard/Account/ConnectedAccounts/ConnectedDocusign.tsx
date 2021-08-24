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
import Flex from 'styled-flex-component'

import { Avatar } from 'components/Avatar'
import { DangerButton } from 'components/Button/DangerButton'
import { getContactNameInitials } from 'models/contacts/helpers'

interface Props {
  user: IUser
  onDisconnect: () => void
}

const ConnectedAccountListItem = styled(ListItem)`
  border-bottom: 1px solid
    ${({ theme }: ThemeProps<Theme>) => theme.palette.divider};
`

export default function ConnectedAccount({ user, onDisconnect }: Props) {
  return (
    <ConnectedAccountListItem button>
      <ListItemAvatar>
        <Avatar user={user} style={{ marginRight: '1rem' }}>
          {getContactNameInitials(user)}
        </Avatar>
      </ListItemAvatar>
      <Grid container>
        <Grid item xs={4}>
          <ListItemText
            primary={user.email}
            secondary={
              <Flex alignCenter>
                <div style={{ marginRight: '0.5rem' }}>DocuSign</div>
              </Flex>
            }
          />
        </Grid>

        <ListItemSecondaryAction>
          <DangerButton variant="outlined" size="small" onClick={onDisconnect}>
            Disconnect Account
          </DangerButton>
        </ListItemSecondaryAction>
      </Grid>
    </ConnectedAccountListItem>
  )
}

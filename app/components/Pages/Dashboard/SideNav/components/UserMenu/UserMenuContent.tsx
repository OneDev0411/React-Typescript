import React from 'react'
import { browserHistory } from 'react-router'
import {
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core'
import { mdiCogOutline } from '@mdi/js'

import { getActiveBrand } from '../../../../../../utils/user-teams'

import Acl from '../../../../../../views/components/Acl'
import { ACL } from '../../../../../../constants/acl'
import { ScrollableArea } from '../../../../../../views/components/ScrollableArea'
import { SvgIcon } from '../../../../../../views/components/SvgIcons/SvgIcon'

import TeamSwitcher from './TeamSwitcher'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      width: theme.spacing(32),
      height: 'min-content',
      // we set a max height to prevent menu from being clipped when it's longer
      // than viewport height.
      maxHeight: `calc(
        100vh - ${theme.spacing(9)}px
      )`
    }
  }),
  { name: 'UserMenuContent' }
)

interface Props {
  user: IUser
  onClose?: () => void
  showChecklists: boolean
}

export function UserMenuContent({
  user,
  showChecklists,
  onClose = () => {}
}: Props) {
  const theme = useTheme<Theme>()
  const classes = useStyles()
  const activeBrand = getActiveBrand(user)

  const onClick = page => {
    onClose()
    browserHistory.push(`/dashboard/${page}`)
  }

  return (
    <div className={classes.container}>
      <ScrollableArea hasThinnerScrollbar>
        <List disablePadding>
          <TeamSwitcher user={user} />
        </List>
      </ScrollableArea>

      <List disablePadding>
        <Acl.Admin>
          {user.teams && user.teams.length > 1 && (
            <ListSubheader>Team Settings</ListSubheader>
          )}
          {activeBrand && activeBrand.brand_type === 'Brokerage' && (
            <Acl access={[ACL.ADMIN, ACL.MARKETING]}>
              <ListItem button onClick={() => onClick('brand-settings')}>
                Brand
              </ListItem>
            </Acl>
          )}
          <ListItem button onClick={() => onClick('teams')}>
            Members
          </ListItem>
          <Acl.Admin>
            <ListItem button onClick={() => onClick('contexts')}>
              Contexts
            </ListItem>
          </Acl.Admin>
          {showChecklists && (
            <ListItem button onClick={() => onClick('checklists')}>
              Checklists
            </ListItem>
          )}
          <Divider role="separator" />
        </Acl.Admin>
        <ListItem divider button onClick={() => onClick('account')}>
          <ListItemIcon>
            <SvgIcon path={mdiCogOutline} color={theme.palette.common.black} />
          </ListItemIcon>
          <ListItemText>Account Settings</ListItemText>
        </ListItem>
        <ListItem
          button
          onClick={() => {
            onClose()
            window.location.pathname = 'signout'
          }}
        >
          <ListItemText>Sign out</ListItemText>
        </ListItem>
      </List>
    </div>
  )
}

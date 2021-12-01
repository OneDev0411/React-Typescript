import {
  ListSubheader,
  ListItemText,
  ListItemIcon,
  makeStyles,
  ListItem,
  Divider,
  List,
  Theme
} from '@material-ui/core'
import { mdiLogoutVariant, mdiCogOutline } from '@mdi/js'
import { browserHistory } from 'react-router'

import { hasUserAccessToBrandSettings } from '@app/utils/user-teams'
import Acl from '@app/views/components/Acl'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { ActiveTeam } from './ActiveTeam'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      width: theme.spacing(32),
      height: 'min-content',
      minWidth: '295px', // Figma
      // we set a max height to prevent menu from being clipped when it's longer
      // than viewport height.
      maxHeight: `calc(
        100vh - ${theme.spacing(9)}px
      )`
    },
    ListSubheader: {
      ...theme.typography.overline
    },
    listItem: {
      ...theme.typography.body2
    },
    listItemIcon: {
      minWidth: 'unset',
      marginRight: theme.spacing(2),
      color: theme.palette.common.black
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
  const classes = useStyles()
  const hasAccessToBrandSettings = hasUserAccessToBrandSettings(user)

  const onClick = (path: string) => {
    onClose()
    browserHistory.push(`/dashboard/${path}`)
  }

  return (
    <div className={classes.container}>
      <ActiveTeam />

      <List disablePadding>
        <Acl.Admin>
          {user.teams && user.teams.length > 1 && (
            <ListSubheader className={classes.ListSubheader}>
              Team Settings
            </ListSubheader>
          )}
          {hasAccessToBrandSettings && (
            <ListItem
              button
              className={classes.listItem}
              onClick={() => onClick('brand-settings')}
            >
              Brand
            </ListItem>
          )}
          <ListItem
            button
            className={classes.listItem}
            onClick={() => onClick('teams')}
          >
            Members
          </ListItem>
          <Acl.Admin>
            <ListItem
              button
              className={classes.listItem}
              onClick={() => onClick('contexts')}
            >
              Contexts
            </ListItem>
          </Acl.Admin>
          <Acl.Admin>
            <ListItem
              button
              className={classes.listItem}
              onClick={() => onClick('statuses')}
            >
              Statuses
            </ListItem>
          </Acl.Admin>
          {showChecklists && (
            <ListItem
              button
              className={classes.listItem}
              onClick={() => onClick('checklists')}
            >
              Checklists
            </ListItem>
          )}
          <Divider role="separator" />
        </Acl.Admin>
        <ListItem
          divider
          button
          className={classes.listItem}
          onClick={() => onClick('account')}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <SvgIcon path={mdiCogOutline} />
          </ListItemIcon>
          <ListItemText disableTypography>Account Settings</ListItemText>
        </ListItem>
        <ListItem
          button
          className={classes.listItem}
          onClick={() => {
            onClose()
            window.location.pathname = 'signout'
          }}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <SvgIcon path={mdiLogoutVariant} />
          </ListItemIcon>
          <ListItemText disableTypography>Sign out</ListItemText>
        </ListItem>
      </List>
    </div>
  )
}

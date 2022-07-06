import { makeStyles, Theme } from '@material-ui/core'

import SideNavMenu from './SideNavMenu'
import { appSidenavWidth } from './variables'

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    [theme.breakpoints.up('md')]: {
      flexBasis: appSidenavWidth,
      width: appSidenavWidth,
      flexShrink: 0
    },
    zIndex: theme.zIndex.sideNavDrawer
  },
  drawerPaper: {
    flexBasis: appSidenavWidth
  }
}))

export default function AppSideNav() {
  const classes = useStyles()

  return (
    <nav className={classes.drawer} aria-label="menu">
      <SideNavMenu />
    </nav>
  )
}

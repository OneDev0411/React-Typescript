import { makeStyles, Theme } from '@material-ui/core'

import Menu from './Menu'
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
      <Menu />
    </nav>
  )
}

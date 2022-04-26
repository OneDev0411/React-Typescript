import React from 'react'

import { makeStyles, Theme, Hidden } from '@material-ui/core'

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

interface Props {
  isMenuOpen: boolean
  onDrawerToggle: () => void
}

export default function AppSideNav({ isMenuOpen, onDrawerToggle }: Props) {
  const classes = useStyles()

  return (
    <Hidden smDown>
      <nav className={classes.drawer} aria-label="menu">
        <SideNavMenu />
      </nav>
    </Hidden>
  )
}

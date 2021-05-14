import React from 'react'

import { Drawer, Hidden, makeStyles, Theme } from '@material-ui/core'

import { appSidenavWidth } from './variables'

import { Menu } from './Menu'

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    [theme.breakpoints.up('md')]: {
      flexBasis: appSidenavWidth,
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
    <nav className={classes.drawer} aria-label="menu">
      <Hidden mdUp implementation="css">
        <Drawer
          container={document.body}
          variant="temporary"
          anchor="left"
          open={isMenuOpen}
          onClose={onDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true
          }}
        >
          <Menu />
        </Drawer>
      </Hidden>

      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          <Menu />
        </Drawer>
      </Hidden>
    </nav>
  )
}

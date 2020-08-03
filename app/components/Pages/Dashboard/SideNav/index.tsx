import React from 'react'

import { Drawer, Hidden, makeStyles, Theme } from '@material-ui/core'

import { appSidenavWidth } from './variables'

import { Menu } from './Menu'

interface Props {
  isMenuOpen: boolean
  onDrawerToggle: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: appSidenavWidth,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: appSidenavWidth,
    backgroundColor: '#253053',
    color: theme.palette.common.white
  }
}))

export default function AppSideNav({ isMenuOpen, onDrawerToggle }: Props) {
  const classes = useStyles()

  return (
    <nav className={classes.drawer} aria-label="menu">
      <Hidden smUp implementation="css">
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

      <Hidden xsDown implementation="css">
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

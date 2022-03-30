import React, { createContext, useState } from 'react'

import { Box, Hidden, makeStyles, Theme } from '@material-ui/core'

import SideNav from './SideNav'
import { SideNavHamburgerButton } from './SideNav/components/SideNavHamburgerButton'
import { appSidenavWidth } from './SideNav/variables'

interface Props {
  children: React.ReactNode
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    main: {
      minHeight: '100vh',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      // I hate using calc and it's totally wrong.
      // I'm currently a release blocker and don't have time to
      // properly fix it.
      // TODO
      width: `calc(100% - ${appSidenavWidth}px)`
    }
  }),
  { name: 'MainWrapper' }
)

export const SideNavContext = createContext({
  isDrawerOpen: false,
  onDrawerToggle: () => {}
})

export function DashboardLayout({ children }: Props) {
  const classes = useStyles()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleDrawerToggle = () => setIsDrawerOpen(state => !state)

  return (
    <SideNavContext.Provider
      value={{
        isDrawerOpen,
        onDrawerToggle: handleDrawerToggle
      }}
    >
      <Box>
        <SideNavHamburgerButton />
        <Box display="flex">
          <Hidden smDown={!isDrawerOpen}>
            <SideNav />
          </Hidden>
          <main className={classes.main}>{children}</main>
        </Box>
      </Box>
    </SideNavContext.Provider>
  )
}

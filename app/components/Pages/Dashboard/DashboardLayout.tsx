import React, { createContext, useState } from 'react'
import { Box, Theme, makeStyles } from '@material-ui/core'

import { appSidenavWidth } from './SideNav/variables'
import SideNav from './SideNav'

interface Props {
  children: React.ReactNode
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    main: {
      width: '100%',
      minHeight: '100vh',
      flexGrow: 1,
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${appSidenavWidth}px)`
      }
    }
  }),
  { name: 'MainWrapper' }
)

export const SideNavContext = createContext({
  toggle: () => {}
})

export function DashboardLayout({ children }: Props) {
  const classes = useStyles()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleToggle = () => setIsMenuOpen(state => !state)

  return (
    <SideNavContext.Provider
      value={{
        toggle: handleToggle
      }}
    >
      <Box display="flex">
        <SideNav isMenuOpen={isMenuOpen} onDrawerToggle={handleToggle} />
        <main className={classes.main}>{children}</main>
      </Box>
    </SideNavContext.Provider>
  )
}

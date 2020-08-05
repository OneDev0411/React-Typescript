import React, { createContext, useState } from 'react'
import { Box, makeStyles } from '@material-ui/core'

import SideNav from './SideNav'

interface Props {
  children: React.ReactNode
}

const useStyles = makeStyles(() => ({
  main: {
    height: '100vh',
    flexGrow: 1
  }
}))

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

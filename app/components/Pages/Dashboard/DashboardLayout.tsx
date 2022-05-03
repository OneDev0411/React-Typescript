import React, { createContext, useState } from 'react'

import { Hidden, makeStyles } from '@material-ui/core'

import SideNav from './SideNav'
import { SideNavToggleButton } from './SideNav/components/SideNavToggleButton'
import { appSidenavWidth } from './SideNav/variables'

interface Props {
  children: React.ReactNode
}

const useStyles = makeStyles(
  () => ({
    drawerWrapper: {
      display: 'flex'
    },
    main: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      minHeight: '100vh',
      width: `calc(100% - ${appSidenavWidth}px)`
    }
  }),
  { name: 'DashboardLayout' }
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
      <div>
        <SideNavToggleButton />
        <div className={classes.drawerWrapper}>
          <Hidden smDown={!isDrawerOpen}>
            <SideNav />
          </Hidden>
          <main className={classes.main}>{children}</main>
        </div>
      </div>
    </SideNavContext.Provider>
  )
}

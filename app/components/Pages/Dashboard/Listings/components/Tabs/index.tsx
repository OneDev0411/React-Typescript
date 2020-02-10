import React from 'react'
import { Box } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import { PageTabs, TabLink } from 'components/PageTabs'

import ViewSwitcher from '../GridControllers/ViewSwitcher'
import SortDrowndown from '../GridControllers/SortDropdown'

interface Props {
  onChangeView: () => void
  activeView: 'map' | 'grid' | 'list'
  isWidget?: boolean
}

interface TabsShape {
  label: string
  to: string
  component?: React.ReactNode
}

const tabs: TabsShape[] = [
  {
    label: 'All properties',
    to: '/dashboard/mls'
  },
  {
    label: 'Favorites',
    to: '/dashboard/mls/favorites'
  }
]

export const Tabs = ({ onChangeView, activeView, isWidget }: Props) => {
  const currentUrl = window.location.pathname
  const theme = useTheme<Theme>()

  return (
    <Box display="flex">
      <Box flexGrow="1">
        <PageTabs
          defaultValue={currentUrl}
          tabs={tabs.map(({ label, to, component = false }, i) => {
            const hasComponent = component ? { component } : {}

            return (
              <TabLink
                key={i}
                {...hasComponent}
                label={label}
                to={to}
                value={to}
              />
            )
          })}
        />
      </Box>
      <Box
        display="flex"
        flexGrow="1"
        borderBottom={`2px solid ${theme.palette.divider}`}
        margin={theme.spacing(1, 0)}
        padding={theme.spacing(0, 1)}
        justifyContent="flex-end"
      >
        <SortDrowndown />
        {!isWidget && (
          <ViewSwitcher onChangeView={onChangeView} activeView={activeView} />
        )}
      </Box>
    </Box>
  )
}

export default Tabs

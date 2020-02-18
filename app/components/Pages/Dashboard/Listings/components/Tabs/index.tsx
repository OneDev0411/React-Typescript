import React, { ReactNode } from 'react'
import { Box } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import { PageTabs, Tab, TabLink } from 'components/PageTabs'

import SavedSearchesList from '../../SavedSearchesList'
import ViewSwitcher from '../GridControllers/ViewSwitcher'
import SortDrowndown from '../GridControllers/SortDropdown'

interface Props {
  onChangeView: () => void
  onChangeSort: () => void
  activeView: 'map' | 'grid' | 'list'
  isWidget?: boolean
}

interface TabsShape {
  label: string
  to: string
  component?: ReactNode
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

export const Tabs = ({
  onChangeView,
  activeView,
  isWidget,
  onChangeSort
}: Props) => {
  const currentUrl = window.location.pathname
  const theme = useTheme<Theme>()
  const linkTabs = tabs.map(({ label, to }, i) => {
    return <TabLink key={i} label={label} to={to} value={to} />
  })

  return (
    <Box display="flex">
      <Box flexGrow="1">
        <PageTabs
          defaultValue={currentUrl}
          tabs={[
            ...linkTabs,
            <Tab key="saved" label={<SavedSearchesList />} />
          ]}
        />
      </Box>
      <Box
        display="flex"
        flexGrow="1"
        borderBottom={`2px solid ${theme.palette.divider}`}
        my={1}
        justifyContent="flex-end"
      >
        <SortDrowndown onChangeSort={onChangeSort} />
        {!isWidget && (
          <ViewSwitcher onChangeView={onChangeView} activeView={activeView} />
        )}
      </Box>
    </Box>
  )
}

export default Tabs

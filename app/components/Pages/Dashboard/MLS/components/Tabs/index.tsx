import React, { ReactNode } from 'react'

import { Box } from '@material-ui/core'

import { WithRouterProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import { PageTabs, Tab, TabLink } from '@app/views/components/PageTabs'

import SavedSearchesList from '../SavedSearchesList'

interface Props extends WithRouterProps {
  isWidget: boolean
  user: IUser
}

interface TabsShape {
  label: string
  to: string
  component?: ReactNode
  allowAnonymousAccess: boolean
}

const tabLinks: TabsShape[] = [
  {
    label: 'Explore',
    to: '/dashboard/mls',
    allowAnonymousAccess: true
  },
  {
    label: 'Favorites',
    to: '/dashboard/mls/favorites',
    allowAnonymousAccess: false
  }
]

export const Tabs = ({ user, isWidget, location, ...rest }: Props) => {
  const currentUrl = location.pathname

  let availableTabs: React.ReactNode[]

  availableTabs = tabLinks.map(({ label, to, allowAnonymousAccess }, i) => {
    return (
      (user || allowAnonymousAccess) &&
      !isWidget && <TabLink key={i} label={label} to={to} value={to} />
    )
  })

  if (user && !isWidget) {
    availableTabs = [
      ...availableTabs,
      <Tab
        key="saved-list"
        value="saved-searches"
        label={<SavedSearchesList location={location} {...rest} />}
      />
    ]
  }

  return (
    <Box display={{ xs: 'none', md: 'flex' }}>
      <Box flexGrow="1">
        <PageTabs
          defaultValue={currentUrl}
          tabs={availableTabs}
          value={
            currentUrl.includes('saved-searches') ? 'saved-searches' : null
          }
        />
      </Box>
    </Box>
  )
}

export default withRouter(Tabs)

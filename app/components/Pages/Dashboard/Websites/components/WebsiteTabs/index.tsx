import React from 'react'

import { PageTabs, TabLink } from 'components/PageTabs'

import { websiteTabs } from '../../constants'
import { WebsiteTabType } from '../../types'

export interface WebsiteTabsProps {
  type: WebsiteTabType
  hasAgentTab: boolean
  hasPropertyTab: boolean
}

function WebsiteTabs({ type, hasAgentTab, hasPropertyTab }: WebsiteTabsProps) {
  const tabs = [
    <TabLink
      key={1}
      value={websiteTabs.MyWebsites}
      to="/dashboard/websites"
      label="My Websites"
    />,
    hasAgentTab && (
      <TabLink
        key={2}
        value={websiteTabs.Agent}
        to={`/dashboard/websites/templates/${websiteTabs.Agent}`}
        label="Agent IDX Sites"
      />
    ),
    hasPropertyTab && (
      <TabLink
        key={3}
        value={websiteTabs.Listing}
        to={`/dashboard/websites/templates/${websiteTabs.Listing}`}
        label="Property Sites"
      />
    )
  ]

  return <PageTabs defaultValue={type} hasMegaMenu tabs={tabs} />
}

export default WebsiteTabs

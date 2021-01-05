import React from 'react'

import { PageTabs, TabLink } from 'components/PageTabs'

import { websiteTabs } from '../../constants'
import { WebsiteTabType } from '../../types'

export interface WebsiteTabsProps {
  type: WebsiteTabType
}

const tabs = [
  <TabLink
    key={1}
    value={websiteTabs.MyWebsites}
    to="/dashboard/websites"
    label="My Websites"
  />,
  <TabLink
    key={2}
    value={websiteTabs.Agent}
    to={`/dashboard/websites/templates/${websiteTabs.Agent}`}
    label="Agent IDX Sites"
  />,
  <TabLink
    key={3}
    value={websiteTabs.Listing}
    to={`/dashboard/websites/templates/${websiteTabs.Listing}`}
    label="Property Sites"
  />
]

function WebsiteTabs({ type }: WebsiteTabsProps) {
  return <PageTabs defaultValue={type} hasMegaMenu tabs={tabs} />
}

export default WebsiteTabs

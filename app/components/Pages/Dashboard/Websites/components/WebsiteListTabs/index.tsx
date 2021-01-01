import React from 'react'

import { PageTabs, TabLink } from 'components/PageTabs'

export interface WebsiteListTabsProps {
  tab: 'mine' | 'agents' | 'properties'
}

const tabs = [
  <TabLink key={1} value="mine" to="/dashboard/websites" label="My Websites" />,
  <TabLink
    key={2}
    value="agents"
    to="/dashboard/websites/agents"
    label="Agent IDX Sites"
  />,
  <TabLink
    key={3}
    value="properties"
    to="/dashboard/websites/properties"
    label="Property Sites"
  />
]

function WebsiteListTabs({ tab }: WebsiteListTabsProps) {
  return <PageTabs defaultValue={tab} hasMegaMenu tabs={tabs} />
}

export default WebsiteListTabs

import React from 'react'

import { PageTabs, TabLink } from 'components/PageTabs'

export interface WebsiteListTabsProps {
  type: IWebsiteTemplateType | 'MyWebsites'
}

const tabs = [
  <TabLink
    key={1}
    value="MyWebsites"
    to="/dashboard/websites"
    label="My Websites"
  />,
  <TabLink
    key={2}
    value="Agents"
    to="/dashboard/websites/templates/Agents"
    label="Agent IDX Sites"
  />,
  <TabLink
    key={3}
    value="Properties"
    to="/dashboard/websites/templates/Properties"
    label="Property Sites"
  />
]

function WebsiteListTabs({ type }: WebsiteListTabsProps) {
  return <PageTabs defaultValue={type} hasMegaMenu tabs={tabs} />
}

export default WebsiteListTabs

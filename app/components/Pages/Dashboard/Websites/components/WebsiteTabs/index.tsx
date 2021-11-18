import React from 'react'

import { PageTabs, TabLink } from 'components/PageTabs'

import { myWebsitesTab } from '../../constants'
import { WebsiteTabWithTemplatesCollection } from '../../types'

export interface WebsiteTabsProps {
  value: string
  tabs: WebsiteTabWithTemplatesCollection
}

function WebsiteTabs({ value, tabs }: WebsiteTabsProps) {
  return (
    <PageTabs
      defaultValue={value}
      hasMegaMenu
      tabs={[
        <TabLink
          key={1}
          value={myWebsitesTab}
          to="/dashboard/websites"
          label="My Websites"
        />,
        ...Object.values(tabs)
          .filter(tab => tab.templates.length > 0)
          .map(tab => (
            <TabLink
              key={tab.key}
              value={tab.key}
              to={`/dashboard/websites/templates/${tab.key}`}
              label={`${tab.title} Sites`}
            />
          ))
      ]}
    />
  )
}

export default WebsiteTabs

import { PageTabs, TabLink } from 'components/PageTabs'

import {
  WebsitesRouteRoots,
  WebsiteTabWithTemplatesCollection
} from '../../types'

export interface WebsiteTabsProps {
  myTitle?: string
  routeRoot?: WebsitesRouteRoots
  value: string
  tabs: WebsiteTabWithTemplatesCollection
}

function WebsiteTabs({
  myTitle = 'Websites',
  routeRoot = 'websites',
  value,
  tabs
}: WebsiteTabsProps) {
  return (
    <PageTabs
      defaultValue={value}
      hasMegaMenu
      tabs={[
        <TabLink
          key={1}
          value={routeRoot}
          to={`/dashboard/${routeRoot}`}
          label={`My ${myTitle}`}
        />,
        ...Object.values(tabs)
          .filter(tab => tab.templates.length > 0)
          .map(tab => (
            <TabLink
              key={tab.key}
              value={tab.key}
              to={`/dashboard/${routeRoot}/templates/${tab.key}`}
              label={tab.title}
            />
          ))
      ]}
    />
  )
}

export default WebsiteTabs

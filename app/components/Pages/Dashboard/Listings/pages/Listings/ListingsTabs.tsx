import { PageTabs, TabLink } from '@app/views/components/PageTabs'

import { ListingTab } from './types'

interface ListingsTabsProps {
  value: UUID
  tabs: ListingTab[]
}

function ListingsTabs({ tabs, value }: ListingsTabsProps) {
  return (
    <PageTabs
      defaultValue={value}
      hasMegaMenu
      tabs={tabs.map(tab => (
        <TabLink
          key={tab.value}
          value={tab.value}
          to={`/dashboard/listings/${tab.value}`}
          label={tab.label}
        />
      ))}
    />
  )
}

export default ListingsTabs

import { PageTabs, TabLink } from '@app/views/components/PageTabs'

import { listingTabs } from '../../constants'
import { ListingTabType } from '../../types'

export interface ListingsTabsProps {
  type: ListingTabType
}

function ListingsTabs({ type }: ListingsTabsProps) {
  const tabs = [
    <TabLink
      key={1}
      value={listingTabs.MyListings}
      to="/dashboard/listings"
      label="My Listings"
    />,
    <TabLink
      key={2}
      value={listingTabs.BrokerageListings}
      to={`/dashboard/listings/${listingTabs.BrokerageListings}`}
      label="Brokerage Listings"
    />
  ]

  return <PageTabs defaultValue={type} hasMegaMenu tabs={tabs} />
}

export default ListingsTabs

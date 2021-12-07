import { useActiveBrandId } from 'hooks/brand/use-active-brand-id'
import { useActiveTeamBrands } from 'hooks/team/use-active-team-brands'

import { ListingTab } from './types'
import useListingsIsLeafBrand from './use-listings-is-leaf-brand'

interface UseListingsTabsReturn {
  tab: Nullable<ListingTab>
  tabs: ListingTab[]
}

function useListingsTabs(brandId?: UUID): UseListingsTabsReturn {
  const myListingsLabel = 'My Listings'

  const activeBrandId = useActiveBrandId()
  const brands = useActiveTeamBrands()
  const isLeafBrand = useListingsIsLeafBrand(brands)

  const tabs = brands
    .filter(brand => brand.brand_type !== 'Other' || isLeafBrand(brand))
    .map<ListingTab>(brand => ({
      label: brand.brand_type === 'Personal' ? myListingsLabel : brand.name,
      value: brand.id,
      hasActions: brand.id === activeBrandId
    }))

  const selectedTab = tabs.find(tab =>
    brandId ? tab.value === brandId : tab.label === myListingsLabel
  )
  const firstTab: Nullable<ListingTab> = tabs[0] ?? null

  return {
    tab: selectedTab ?? firstTab,
    tabs
  }
}

export default useListingsTabs

import { useSelector } from 'react-redux'

import { selectActiveTeam, selectActiveTeamBrands } from '@app/selectors/team'

import { ListingTab } from './types'

interface UseListingsTabsReturn {
  tab: Nullable<ListingTab>
  tabs: ListingTab[]
}

function useListingsTabs(brandId?: UUID): UseListingsTabsReturn {
  const myListingsLabel = 'My Listings'

  const activeTeamBrandId = useSelector(selectActiveTeam).brand.id
  const brands = useSelector(selectActiveTeamBrands)

  const tabs = brands
    .filter(brand => brand.brand_type !== 'Other')
    .map<ListingTab>(brand => ({
      label: brand.brand_type === 'Personal' ? myListingsLabel : brand.name,
      value: brand.id,
      hasActions: brand.id === activeTeamBrandId
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

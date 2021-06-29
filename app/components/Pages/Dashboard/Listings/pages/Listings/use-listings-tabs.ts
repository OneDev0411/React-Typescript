import { useSelector } from 'react-redux'

import { selectUserTeams } from '@app/selectors/team'

import { ListingTab } from './types'

interface UseListingsTabsReturn {
  tab: Nullable<ListingTab>
  tabs: ListingTab[]
}

function useListingsTabs(brandId?: UUID): UseListingsTabsReturn {
  const myListingsLabel = 'My Listings'
  const teams = useSelector(selectUserTeams)

  const tabs = teams
    .filter(team => team.brand.brand_type !== 'Other')
    .map<ListingTab>(team => ({
      label:
        team.brand.brand_type === 'Personal'
          ? myListingsLabel
          : team.brand.name,
      value: team.brand.id,
      hasActions: team.brand.brand_type === 'Personal'
    }))
    .reverse()

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

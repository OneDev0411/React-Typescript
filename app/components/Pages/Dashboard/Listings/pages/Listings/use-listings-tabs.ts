import { useSelector } from 'react-redux'

import { selectUserTeams } from '@app/selectors/team'

import { ListingTab } from './types'

interface UseListingsTabsReturn {
  value: Nullable<UUID>
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
      value: team.brand.id
    }))
    .reverse()

  const selectedTabValue = tabs.find(tab =>
    brandId ? tab.value === brandId : tab.label === myListingsLabel
  )?.value
  const firstTabValue: Nullable<UUID> = tabs[0]?.value ?? null

  return {
    value: selectedTabValue ?? firstTabValue,
    tabs
  }
}

export default useListingsTabs

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { useBrandStatuses } from '@app/hooks/use-brand-statuses'

import Grid from './Grid'
import { useSearchQuery } from './hooks/use-search-query'
import { SearchQuery } from './types'

interface Props {
  searchQuery: SearchQuery
}

export function OtherTabsWrapper({ searchQuery }: Props) {
  const activeBrandId = useActiveBrandId()
  const [statuses] = useBrandStatuses(activeBrandId)

  useSearchQuery(searchQuery, statuses)

  return (
    <Grid searchQuery={searchQuery} statuses={statuses} isSearching={false} />
  )
}

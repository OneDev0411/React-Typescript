import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { useBrandStatuses } from '@app/hooks/use-brand-statuses'

import SearchTable from './SearchTable'
import { SearchQuery } from './types'

interface Props {
  searchQuery: SearchQuery
}

export function SearchTabWrapper({ searchQuery }: Props) {
  const activeBrandId = useActiveBrandId()

  const [statuses] = useBrandStatuses(activeBrandId)

  return <SearchTable searchQuery={searchQuery} statuses={statuses} />
}

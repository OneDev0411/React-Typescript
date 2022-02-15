import { useSelector } from 'react-redux'

import { selectUser } from '@app/selectors/user'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { getActiveTeamId } from 'utils/user-teams'

import Grid from './Grid'
import { useSearchQuery } from './hooks/use-search-query'
import { SearchQuery } from './types'

interface Props {
  searchQuery: SearchQuery
}

export function OtherTabsWrapper({ searchQuery }: Props) {
  const user = useSelector(selectUser)

  const [statuses] = useBrandStatuses(getActiveTeamId(user)!)

  useSearchQuery(searchQuery, statuses)

  return (
    <Grid searchQuery={searchQuery} statuses={statuses} isSearching={false} />
  )
}

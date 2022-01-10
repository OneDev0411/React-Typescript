import { useSelector } from 'react-redux'

import { selectUser } from '@app/selectors/user'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { getActiveTeamId } from 'utils/user-teams'

import SearchTable from './SearchTable'
import { SearchQuery } from './types'

interface Props {
  searchQuery: SearchQuery
}

export function SearchTabWrapper({ searchQuery }: Props) {
  const user = useSelector(selectUser)

  const [statuses] = useBrandStatuses(getActiveTeamId(user)!)

  return <SearchTable searchQuery={searchQuery} statuses={statuses} />
}

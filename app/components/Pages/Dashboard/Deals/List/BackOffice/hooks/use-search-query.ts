import { useDispatch, useSelector } from 'react-redux'
import { useDeepCompareEffect } from 'react-use'

import { selectUser } from '@app/selectors/user'
import { searchDeals, getDeals } from 'actions/deals'

import { getClosingsFilterQuery } from '../../helpers/closings'
import type { SearchQuery } from '../types'
import { getStaticFilterQuery } from '../utils/get-static-filter-query'

export function useSearchQuery(
  searchQuery: SearchQuery,
  statuses: IDealStatus[]
) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  /**
   * The inbox tabs call /brands/${brandId}/deals/inbox API then
   * the grid component filters the result on the frontend side.
   * So all of them need just one API call.
   * Other tabs need to call /deals/filter API with their specific filters.
   * This means we don't need to call the API on every tab change.
   * The listKey variable helps this component to be smart and call the
   * APIs at the right time.
   */
  const listKey =
    searchQuery.type === 'inbox'
      ? searchQuery.type
      : [searchQuery.type, searchQuery.filter].join('-')

  useDeepCompareEffect(() => {
    const { type, term, filter } = searchQuery

    if (type === 'query' && filter === 'closings') {
      dispatch(searchDeals(user, getClosingsFilterQuery(searchQuery.term)))

      return
    }

    if (searchQuery.type === 'query') {
      dispatch(searchDeals(user, getStaticFilterQuery(searchQuery, statuses)))

      return
    }

    if (type === 'inbox') {
      dispatch(term ? searchDeals(user, term) : getDeals(user))
    }
  }, [listKey, searchQuery.term, statuses, user])
}

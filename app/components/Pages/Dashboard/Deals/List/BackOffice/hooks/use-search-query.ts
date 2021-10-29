import { useDispatch, useSelector } from 'react-redux'
import { useDeepCompareEffect } from 'react-use'

import { selectUser } from '@app/selectors/user'
import { setUserSetting } from '@app/store_actions/user/set-setting'
import { searchDeals, getDeals } from 'actions/deals'

import { DEAL_GRID_FILTER_SETTING_KEY } from '../../../constants/settings'
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
    } else if (searchQuery.type === 'query' && statuses.length > 0) {
      dispatch(searchDeals(user, getStaticFilterQuery(searchQuery)))
    } else if (type === 'inbox') {
      dispatch(term ? searchDeals(user, term) : getDeals(user))
    }

    dispatch(setUserSetting(DEAL_GRID_FILTER_SETTING_KEY, searchQuery))
  }, [listKey, searchQuery.term, statuses])
}

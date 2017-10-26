import toggleSubStatuses from './toggle-sub-statuses'
import { ACTIVE_PENDING_STATUSES } from '../../../../constants/listings/search/filters'
import { pendingStatuses } from '../../../../components/Pages/Dashboard/Listings/Search/components/Filters/statuses'

const activePendingListings = event => (dispatch, getState) => {
  dispatch({
    type: ACTIVE_PENDING_STATUSES
  })

  return toggleSubStatuses(pendingStatuses, event.target.checked)(dispatch)
}

export default activePendingListings

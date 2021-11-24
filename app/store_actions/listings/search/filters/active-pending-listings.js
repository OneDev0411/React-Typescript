import { PENDING_STATUSES } from '@app/components/Pages/Dashboard/MLS/constants'
import { ACTIVE_PENDING_STATUSES } from '@app/constants/listings/search/filters'

import toggleSubStatuses from './toggle-sub-statuses'

const activePendingListings = event => dispatch => {
  dispatch({
    type: ACTIVE_PENDING_STATUSES
  })

  return toggleSubStatuses(PENDING_STATUSES, event.target.checked)(dispatch)
}

export default activePendingListings

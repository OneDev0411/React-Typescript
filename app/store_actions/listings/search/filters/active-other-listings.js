import { otherStatuses } from '../../../../components/Pages/Dashboard/Listings/Search/components/Filters/statuses'

import toggleSubStatuses from './toggle-sub-statuses'

const activeOtherListings = event => dispatch => {
  dispatch({
    type: 'ACTIVE_OTHER_STATUSES_LISTINGS'
  })

  return toggleSubStatuses(otherStatuses, event.target.checked)(dispatch)
}

export default activeOtherListings

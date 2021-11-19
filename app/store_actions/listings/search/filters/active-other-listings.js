import { OTHER_STATUSES } from '@app/components/Pages/Dashboard/MLS/constants'

import toggleSubStatuses from './toggle-sub-statuses'

const activeOtherListings = event => dispatch => {
  dispatch({
    type: 'ACTIVE_OTHER_STATUSES_LISTINGS'
  })

  return toggleSubStatuses(OTHER_STATUSES, event.target.checked)(dispatch)
}

export default activeOtherListings

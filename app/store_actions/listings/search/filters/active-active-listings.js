import { formValueSelector, change } from 'redux-form'

import toggleSubStatuses from './toggle-sub-statuses'
import { ACTIVE_ACTIVE_STATUS } from '../../../../constants/listings/search/filters'
import { activeStatuses } from '../../../../components/Pages/Dashboard/Listings/Search/components/Filters/statuses'

// const formName = 'filters'
// const selector = formValueSelector(formName)

const activeActiveListings = event => (dispatch, getState) => {
  dispatch({
    type: ACTIVE_ACTIVE_STATUS
  })

  return toggleSubStatuses(activeStatuses, event.target.checked)(dispatch)
}

export default activeActiveListings

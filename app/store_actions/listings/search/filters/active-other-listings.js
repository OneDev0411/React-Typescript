// import { formValueSelector, change } from 'redux-form'
import toggleSubStatuses from './toggle-sub-statuses'
import { ACTIVE_ACTIVE_STATUS } from '../../../../constants/listings/search/filters'
import { otherStatuses } from '../../../../components/Pages/Dashboard/Listings/Search/components/Filters/statuses'

// const formName = 'filters'
// const selector = formValueSelector(formName)

const activeOtherListings = event => (dispatch, getState) => {
  dispatch({
    type: 'ACTIVE_OTHER_STATUSES_LISTINGS'
  })

  return toggleSubStatuses(otherStatuses, event.target.checked)(dispatch)
}

export default activeOtherListings

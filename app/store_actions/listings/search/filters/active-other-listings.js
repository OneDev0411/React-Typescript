// import { formValueSelector, change } from 'redux-form'
import toggleSubStatuses from './toggle-sub-statuses'
import { otherStatuses } from '../../../../components/Pages/Dashboard/MLS/Search/components/Filters/statuses'

// const formName = 'filters'
// const selector = formValueSelector(formName)

const activeOtherListings = event => dispatch => {
  dispatch({
    type: 'ACTIVE_OTHER_STATUSES_LISTINGS'
  })

  return toggleSubStatuses(otherStatuses, event.target.checked)(dispatch)
}

export default activeOtherListings

import { formValueSelector, change } from 'redux-form'
import { ACTIVE_ACTIVE_STATUS } from '../../../../constants/listings/search/filters'

const formName = 'filters'
const selector = formValueSelector(formName)

const activeStatuses = [
  'active',
  'active_kick_out',
  'active_contingent',
  'active_option_contract'
]

const activeActiveListings = (event, nextState) => (dispatch, getState) => {
  activeStatuses.forEach(status => {
    const value = event.target.checked
      ? status
          .split('_')
          .map(s => s.charAt(0).toUpperCase() + s.substr(1, s.length))
          .join(' ')
      : null
    dispatch(change(formName, `listing_statuses.${status}`, value))
  })
}

export default activeActiveListings

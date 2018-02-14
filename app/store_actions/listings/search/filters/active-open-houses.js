import { formValueSelector, change } from 'redux-form'
import { ACTIVE_OPEN_HOUSES_STATUS } from '../../../../constants/listings/search/filters'
import { getObjectValues } from './submit-filters-form'

const formName = 'filters'
const selector = formValueSelector(formName)

const activeOpenHouses = (event, nextState) => (dispatch, getState) => {
  if (!nextState) {
    return Promise.resolve()
  }

  const state = getState()

  const anyStatusIsNotSelected =
    getObjectValues(selector(state, 'listing_statuses')).length === 0

  // console.log(anyStatusIsNotSelected)

  if (anyStatusIsNotSelected) {
    event.preventDefault()

    return Promise.resolve()
  }

  const soldListings = selector(state, 'listing_statuses.sold')

  if (soldListings) {
    dispatch(change(formName, 'listing_statuses.sold', ''))

    const activeListings = selector(state, 'listing_statuses.active')

    if (!activeListings) {
      dispatch(change(formName, 'listing_statuses.active', 'Active'))
    }

    dispatch({
      type: ACTIVE_OPEN_HOUSES_STATUS
    })
  }
}

export default activeOpenHouses

import { formValueSelector, change } from 'redux-form'
import { ACTIVE_OPEN_HOUSES_STATUS } from '../../../../constants/listings/search/filters'
import { obiectPropsValueToArray } from './submit-filters-form'

const formName = 'filters'
const selector = formValueSelector(formName)

const activeOpenHouses = (event, nextState) => (dispatch, getState) => {
  if (!nextState) {
    console.log('salam')
    return Promise.resolve()
  }

  const formState = getState().search.filters

  const anyStatusIsNotSelected =
    obiectPropsValueToArray(selector(formState, 'listing_statuses')).length ===
    0

  // console.log(anyStatusIsNotSelected)

  if (anyStatusIsNotSelected) {
    event.preventDefault()
    return Promise.resolve()
  }
  const soldListings = selector(formState, 'listing_statuses.sold')

  if (soldListings) {
    dispatch(change(formName, 'listing_statuses.sold', false))

    const activeListings = selector(formState, 'listing_statuses.active')
    if (!activeListings) {
      dispatch(change(formName, 'listing_statuses.active', true))
    }

    dispatch({
      type: ACTIVE_OPEN_HOUSES_STATUS
    })
  }
}

export default activeOpenHouses

import { formValueSelector, change } from 'redux-form'
import { ACTIVE_OPEN_HOUSES_STATUS } from '../../../../constants/listings/search/filters'

const formName = 'filters'
const selector = formValueSelector(formName)

const activeOpenHouses = (event, nextState) => (dispatch, getState) => {
  if (!nextState) {
    return Promise.resolve()
  }

  const formState = getState().search.filters
  const soldListings = selector(formState, 'listing_statuses.sold')
  const activeListings = selector(formState, 'listing_statuses.active')

  dispatch({
    type: ACTIVE_OPEN_HOUSES_STATUS
  })

  if (soldListings) {
    dispatch(change(formName, 'listing_statuses.sold', false))
  }

  if (!activeListings) {
    dispatch(change(formName, 'listing_statuses.active', true))
  }
}

export default activeOpenHouses

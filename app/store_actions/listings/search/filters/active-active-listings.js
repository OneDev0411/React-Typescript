import { formValueSelector, change } from 'redux-form'
import { ACTIVE_ACTIVE_STATUS } from '../../../../constants/listings/search/filters'

const formName = 'filters'
const selector = formValueSelector(formName)

const activeActiveListings = (event, nextState) => (dispatch, getState) => {
  const formState = getState().search.filters
  const openHouses = selector(formState, 'open_house')
  const soldListings = selector(formState, 'listing_statuses.sold')

  if ((!nextState, openHouses)) {
    event.preventDefault()
    return Promise.resolve()
  }

  if (!nextState) {
    return Promise.resolve()
  }

  dispatch({
    type: ACTIVE_ACTIVE_STATUS
  })

  if (soldListings) {
    dispatch(change(formName, 'listing_statuses.sold', false))
  }
}

export default activeActiveListings

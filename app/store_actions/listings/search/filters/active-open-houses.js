import { formValueSelector, change } from 'redux-form'
import { ACTIVE_OPEN_HOUSES_STATUS } from '../../../../constants/listings/search/filters'

const formName = 'filters'
const selector = formValueSelector(formName)

const activeOpenHouses = (event, nextState) => (dispatch, getState) => {
  if (!nextState) {
    return Promise.resolve()
  }

  const formState = getState().search.filters
  const soldListings = selector(formState, 'soldListings')
  const activeListings = selector(formState, 'activeListings')

  dispatch({
    type: ACTIVE_OPEN_HOUSES_STATUS
  })

  if (soldListings) {
    dispatch(change(formName, 'soldListings', false))
  }

  if (!activeListings) {
    dispatch(change(formName, 'activeListings', true))
  }
}

export default activeOpenHouses

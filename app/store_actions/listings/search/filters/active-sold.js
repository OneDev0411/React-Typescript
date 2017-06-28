import { formValueSelector, change } from 'redux-form'
import { ACTIVE_SOLD_STATUS } from '../../../../constants/listings/search/filters'

const formName = 'filters'
const selector = formValueSelector(formName)

const activeSold = (event, nextState) => (dispatch, getState) => {
  if (!nextState) {
    return Promise.resolve()
  }

  const formState = getState().search.filters
  const activeListings = selector(formState, 'activeListings')
  const openHousesOnlyListings = selector(formState, 'openHousesOnlyListings')

  dispatch({
    type: ACTIVE_SOLD_STATUS
  })

  if (activeListings) {
    dispatch(change(formName, 'activeListings', false))
  }

  if (openHousesOnlyListings) {
    dispatch(change(formName, 'openHousesOnlyListings', false))
  }
}

export default activeSold

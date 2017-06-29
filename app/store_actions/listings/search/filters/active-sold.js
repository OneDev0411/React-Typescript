import { formValueSelector, change } from 'redux-form'
import { ACTIVE_SOLD_STATUS } from '../../../../constants/listings/search/filters'

const formName = 'filters'
const selector = formValueSelector(formName)

const activeSold = (event, nextState) => (dispatch, getState) => {
  if (!nextState) {
    return Promise.resolve()
  }

  const formState = getState().search.filters
  const openHouses = selector(formState, 'open_house')
  const activeListings = selector(formState, 'activeListings')

  dispatch({
    type: ACTIVE_SOLD_STATUS
  })

  if (openHouses) {
    dispatch(change(formName, 'open_house', false))
  }

  if (activeListings) {
    dispatch(change(formName, 'activeListings', false))
  }
}

export default activeSold

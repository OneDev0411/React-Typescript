import { formValueSelector, change } from 'redux-form'
import { ACTIVE_ACTIVE_STATUS } from '../../../../constants/listings/search/filters'

const formName = 'filters'
const selector = formValueSelector(formName)

const activeActiveListings = (event, nextState) => (dispatch, getState) => {
  const formState = getState().search.filters
  const openHouses = selector(formState, 'open_house')

  if (!nextState && openHouses) {
    event.preventDefault()
    return Promise.resolve()
  }
}

export default activeActiveListings

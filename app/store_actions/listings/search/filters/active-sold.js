import { formValueSelector, change } from 'redux-form'
import { ACTIVE_SOLD_STATUS } from '../../../../constants/listings/search/filters'

const formName = 'filters'
const selector = formValueSelector(formName)

const activeSold = (event, nextState) => (dispatch, getState) => {
  if (!nextState) {
    return Promise.resolve()
  }

  const openHouses = selector(getState(), 'open_house')

  dispatch({
    type: ACTIVE_SOLD_STATUS
  })

  if (openHouses) {
    dispatch(change(formName, 'open_house', false))
  }
}

export default activeSold

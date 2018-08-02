import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function getContexts(user = {}) {
  return async dispatch => {
    const contexts = await Deal.getContexts(user)

    dispatch({
      type: actionTypes.GET_CONTEXTS,
      contexts
    })
  }
}

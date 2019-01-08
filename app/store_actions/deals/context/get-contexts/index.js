import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function getContexts(brandId) {
  return async dispatch => {
    const contexts = await Deal.getContexts(brandId)

    dispatch({
      type: actionTypes.GET_CONTEXTS,
      brandId,
      contexts
    })
  }
}

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function getContexts(brandId) {
  return async dispatch => {
    if (!brandId) {
      throw new Error(`Can not get contexts. brandId is ${brandId}`)
    }

    const contexts = await Deal.getContexts(brandId)

    dispatch({
      type: actionTypes.GET_CONTEXTS,
      brandId,
      contexts
    })
  }
}

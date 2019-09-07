import * as actionTypes from '../../../../constants/deals'
import { getContextsByDealId } from '../../../../models/Deal/context/get-contexts-by-deal'

export function getContextsByDeal(dealId) {
  return async dispatch => {
    if (!dealId) {
      throw new Error(`Can not get contexts. brandId is ${dealId}`)
    }

    const contexts = await getContextsByDealId(dealId)

    dispatch({
      type: actionTypes.GET_DEAL_CONTEXTS,
      dealId,
      contexts
    })
  }
}

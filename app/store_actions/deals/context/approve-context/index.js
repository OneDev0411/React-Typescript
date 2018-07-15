import Deal from '../../../../models/Deal'
import { updateDeal } from '../../deal'

export function approveContext(dealId, contextId) {
  return async dispatch => {
    const deal = await Deal.approveContext(dealId, contextId)

    dispatch(updateDeal(deal))
  }
}

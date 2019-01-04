import Deal from '../../../../models/Deal'
import { updateDeal } from '../../deal'

export function upsertContexts(dealId, contexts) {
  return async dispatch => {
    const deal = await Deal.upsertContexts(dealId, contexts)

    dispatch(updateDeal(deal))

    return deal
  }
}

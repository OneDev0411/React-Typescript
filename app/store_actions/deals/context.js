import types from '../../constants/deals'
import Deal from '../../models/Deal'
import { updateDeal } from './deal'

export function updateContext(dealId, ctx, approved = true) {
  return async (dispatch) => {
    const deal = await Deal.updateContext(dealId, ctx, approved)

    dispatch(updateDeal(deal))
  }
}

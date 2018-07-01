import Deal from '../../../../models/Deal'
import { updateDeal } from '../update-deal'

export function updateListing(dealId, listingId) {
  return async dispatch => {
    try {
      const deal = await Deal.updateListing(dealId, listingId)

      dispatch(updateDeal(deal))
    } catch (e) {
      throw e
    }
  }
}

import { changePropertyType } from '../../../../models/Deal/deal'
import { updateDeal } from '../update-deal'

export function updatePropertyType(dealId, propertyType) {
  return async dispatch => {
    try {
      const deal = await changePropertyType(dealId, propertyType)

      dispatch(updateDeal(deal))
    } catch (e) {
      throw e
    }
  }
}

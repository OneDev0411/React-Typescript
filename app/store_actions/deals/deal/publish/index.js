import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function publishDeal(dealId) {
  return async dispatch => {
    try {
      await Deal.publish(dealId)

      dispatch({
        type: actionTypes.EJECT_DRAFT_MODE,
        dealId
      })
    } catch (e) {
      throw e
    }
  }
}

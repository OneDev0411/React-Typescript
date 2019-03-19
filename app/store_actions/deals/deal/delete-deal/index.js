import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function deleteDeal(dealId) {
  return async dispatch => {
    try {
      await Deal.archiveDeal(dealId)

      dispatch({
        type: actionTypes.ARCHIVE_DEAL,
        deal_id: dealId
      })
    } catch (e) {
      throw e
    }
  }
}

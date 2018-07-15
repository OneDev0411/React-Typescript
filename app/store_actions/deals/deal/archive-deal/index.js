import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function archiveDeal(dealId) {
  return async dispatch => {
    try {
      await Deal.archiveDeal(dealId)

      dispatch({
        type: actionTypes.ARCHIVE_DEAL,
        deal_id
      })
    } catch (e) {
      throw e
    }
  }
}

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function voidEnvelope(deal_id, envelope_id) {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.SET_ENVELOPE_STATUS,
        envelope_id,
        status: 'Voided'
      })

      await Deal.voidEnvelope(envelope_id)
    } catch (e) {
      throw e
    }
  }
}

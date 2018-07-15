import { addNotification as notify } from 'reapop'

import Deal from '../../../../models/Deal'
import { updateDeal } from '../update-deal'

export function getDeal(deal_id) {
  return async dispatch => {
    try {
      const deal = await Deal.getById(deal_id)

      dispatch(updateDeal(deal))
    } catch (e) {
      dispatch(
        notify({
          title: e.message,
          message:
            e.response && e.response.body ? e.response.body.message : null,
          status: 'error'
        })
      )

      throw e
    }
  }
}

import { addNotification as notify } from 'components/notification'

import { getById } from '../../../../models/Deal/deal/get-by-id'

import { updateDeal } from '../update-deal'

export function getDeal(deal_id) {
  return async dispatch => {
    try {
      const deal = await getById(deal_id)

      return dispatch(updateDeal(deal))
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

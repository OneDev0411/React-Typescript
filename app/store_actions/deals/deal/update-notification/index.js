import * as actionTypes from '../../../../constants/deals'

export function updateDealNotifications(deal_id, count) {
  return {
    type: actionTypes.UPDATE_NOTIFICATIONS,
    deal_id,
    count
  }
}

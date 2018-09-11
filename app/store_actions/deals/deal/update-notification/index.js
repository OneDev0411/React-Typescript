import * as actionTypes from '../../../../constants/deals'

export function updateDealNotifications(deal, room) {
  const new_notifications = deal.new_notifications
    ? deal.new_notifications.filter(item => item.room !== room.id)
    : []

  return {
    type: actionTypes.UPDATE_NOTIFICATIONS,
    deal_id: deal.id,
    new_notifications
  }
}

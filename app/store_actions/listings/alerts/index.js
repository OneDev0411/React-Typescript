import getAlerts from './get-alerts'
import deleteAlert from './delete-alert'
import getAlertFeed from './get-alert-feed'
import setSelectedAlertId from './set-selected-alert-id'
import { setActivityLog } from './set-alert-activity-log'
import clearAlertNotification from './clear-alert-notification'
import changeAlertFollowStatus from './change-alert-follow-status'

export default {
  getAlerts,
  deleteAlert,
  getAlertFeed,
  setActivityLog,
  setSelectedAlertId,
  clearAlertNotification,
  changeAlertFollowStatus
}

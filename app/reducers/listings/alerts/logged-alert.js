import { LOG_ALERT_ACTIVITY } from '../../../constants/listings/alerts'

export function loggedAlert(state = '', action) {
  switch (action.type) {
    case LOG_ALERT_ACTIVITY:
      return action.id
    default:
      return state
  }
}

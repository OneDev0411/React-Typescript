import { SET_SELECTED_ALERT_ID } from '../../../constants/listings/alerts'

const selectedAlertId = (state = '', action) => {
  switch (action.type) {
    case SET_SELECTED_ALERT_ID:
      return action.id
    default:
      return state
  }
}

export default selectedAlertId

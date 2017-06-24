import { SET_SELECTED_ALERT } from '../../../constants/listings/alerts'

const selectedAlert = (state = '', action) => {
  switch (action.type) {
    case SET_SELECTED_ALERT:
      return action.alert
    default:
      return state
  }
}

export default selectedAlert

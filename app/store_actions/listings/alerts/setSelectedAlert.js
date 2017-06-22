import { SET_SELECTED_ALERT } from '../../../constants/listings/alerts'

const setSelectedAlert = alert => ({
  alert,
  type: SET_SELECTED_ALERT
})

export default setSelectedAlert

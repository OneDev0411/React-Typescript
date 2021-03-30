import {
  ACTIVATE_INTERCOM,
  DEACTIVATE_INTERCOM
} from '../../constants/intercom'

export const intercom = (state = { isActive: false }, action) => {
  switch (action.type) {
    case ACTIVATE_INTERCOM:
      return {
        isActive: true
      }
    case DEACTIVATE_INTERCOM:
      return {
        isActive: false
      }
    default:
      return state
  }
}

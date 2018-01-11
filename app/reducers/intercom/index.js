import { ACTIVE_INTERCOM, INACTIVE_INTERCOM } from '../../constants/intercom'

export const intercom = (state = { isActive: false }, action) => {
  switch (action.type) {
    case ACTIVE_INTERCOM:
      return {
        isActive: true
      }
    case INACTIVE_INTERCOM:
      return {
        isActive: false
      }
    default:
      return state
  }
}

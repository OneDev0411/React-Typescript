import { ACTIVE_INTERCOM, INACTIVE_INTERCOM } from '../../constants/intercom'

export const activeIntercom = isActive => dispatch => {
  if (isActive || !window.Intercom) {
    return Promise.resolve()
  }

  window.Intercom('show')

  dispatch({
    type: ACTIVE_INTERCOM
  })
}

export const inactiveIntercom = isActive => dispatch => {
  if (!isActive || !window.Intercom) {
    return Promise.resolve()
  }

  window.Intercom('hide')

  dispatch({
    type: INACTIVE_INTERCOM
  })
}

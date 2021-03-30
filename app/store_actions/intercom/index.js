import {
  ACTIVATE_INTERCOM,
  DEACTIVATE_INTERCOM
} from '../../constants/intercom'

export const activateIntercom = isActive => dispatch => {
  if (isActive || !window.Intercom) {
    return Promise.resolve()
  }

  window.Intercom('show')

  dispatch({
    type: ACTIVATE_INTERCOM
  })
}

export const deactivateIntercom = isActive => dispatch => {
  if (!isActive || !window.Intercom) {
    return Promise.resolve()
  }

  window.Intercom('hide')

  dispatch({
    type: DEACTIVATE_INTERCOM
  })
}

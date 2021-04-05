import {
  ACTIVATE_INTERCOM,
  DEACTIVATE_INTERCOM
} from '../../constants/intercom'

export const activateIntercom = isActive => dispatch => {
  if (isActive || !window.Intercom) {
    return Promise.resolve()
  }

  dispatch({
    type: ACTIVATE_INTERCOM
  })

  window.Intercom('show')
}

export const deactivateIntercom = isActive => dispatch => {
  if (!isActive || !window.Intercom) {
    return Promise.resolve()
  }

  dispatch({
    type: DEACTIVATE_INTERCOM
  })

  setTimeout(() => {
    window.Intercom('hide')
  }, 500)
}

import types from '../../constants/confirmation'

export function hideConfirmation() {
  return {
    type: types.HIDE_CONFIRMATION
  }
}

export function confirmation(data) {
  return {
    type: types.SHOW_CONFIRMATION,
    data
  }
}

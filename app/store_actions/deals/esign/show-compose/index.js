import * as actionTypes from '../../../../constants/deals'

export function showCompose(display = true) {
  return {
    type: actionTypes.SHOW_COMPOSE,
    display
  }
}

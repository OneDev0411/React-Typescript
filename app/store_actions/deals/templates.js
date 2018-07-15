import * as actionTypes from '../../constants/deals'

export function showTemplates(display = true) {
  return {
    type: actionTypes.SHOW_TEMPLATES,
    display
  }
}

export function showBuilder(display = true) {
  return {
    type: actionTypes.SHOW_BUILDER,
    display
  }
}

import * as types from '../../constants/deals'

export function showTemplates(display = true) {
  return {
    type: types.SHOW_TEMPLATES,
    display
  }
}

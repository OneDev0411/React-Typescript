import types from '../../constants/deals'

export function showTemplates(display = true) {
  return {
    type: types.SHOW_TEMPLATES,
    display
  }
}

export function showBuilder(display = true) {
  return {
    type: types.SHOW_BUILDER,
    display
  }
}
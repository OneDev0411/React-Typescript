import * as types from '../../constants/deals'

const initialState = {
  showTemplates: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_TEMPLATES:
      return {
        ...state,
        showTemplates: action.display
      }

    default:
      return state
  }
}

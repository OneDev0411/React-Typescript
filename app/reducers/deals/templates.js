import * as actionTypes from '../../constants/deals'

const initialState = {
  showTemplates: false,
  showBuilder: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_TEMPLATES:
      return {
        ...state,
        showTemplates: action.display
      }

    case actionTypes.SHOW_BUILDER:
      return {
        ...state,
        showBuilder: action.display
      }

    default:
      return state
  }
}

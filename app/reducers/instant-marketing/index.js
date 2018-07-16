import * as actionTypes from '../../constants/instant-marketing'

const initialState = {
  showBuilder: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_BUILDER:
      return {
        ...state,
        showBuilder: action.display
      }

    default:
      return state
  }
}

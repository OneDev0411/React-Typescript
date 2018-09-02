import * as actionTypes from '../../constants/deals'

const initialState = {
  files: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_UPLOAD_FILES:
      return {
        files: action.files
      }

    case actionTypes.RESET_UPLOAD_FILES:
      return initialState

    case actionTypes.SET_UPLOAD_ATTRIBUTES: {
      const file = state.files[action.fileId]

      return {
        ...state,
        files: {
          ...state.files,
          [action.fileId]: {
            ...file,
            properties: {
              ...file.properties,
              ...action.attributes
            }
          }
        }
      }
    }

    default:
      return state
  }
}

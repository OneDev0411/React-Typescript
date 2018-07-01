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

    case actionTypes.SET_UPLOAD_ATTRIBUTES:
      const { fileId } = action
      const file = state.files[fileId]
      const properties = {
        ...file.properties,
        ...action.attributes
      }

      return {
        ...state,
        files: {
          ...state.files,
          [fileId]: {
            ...file,
            properties
          }
        }
      }

    default:
      return state
  }
}

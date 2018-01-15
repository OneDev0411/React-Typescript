import types from '../../constants/deals'

const initialState = {
  task: null,
  files: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_UPLOAD_FILES:
      return {
        deal: action.deal,
        task: action.task,
        files: action.files
      }

    case types.RESET_UPLOAD_FILES:
      return initialState

    case types.SET_UPLOAD_ATTRIBUTES:
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

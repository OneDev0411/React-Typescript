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

    case types.CLEAR_UPLOAD_FILES:
      return initialState

    case types.SET_UPLOAD_ATTRIBUTES:
      return {
        ...state,
        files: {
          ...state.files,
          [action.fileId]: {
            ...state.files[action.fileId],
            properties: {
              ...state.files[action.fileId].properties,
              ...action.attributes
            }
          }
        }
      }

    default:
      return state
  }
}

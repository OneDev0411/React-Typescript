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

      const file = state.files[action.fileId]

      console.log(file)
      console.log({[action.fileId]: {
            name: file.name,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            preview: file.preview,
            size: file.size,
            type: file.type,
            ...action.attributes
          }})
      return {
        ...state,
        files: {
          ...state.files,
          [action.fileId]: {
            name: file.name,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            preview: file.preview,
            size: file.size,
            type: file.type,
            ...action.attributes
          }
        }
      }

    default:
      return state
  }
}

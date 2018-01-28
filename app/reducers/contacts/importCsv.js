import types from '../../constants/contact'

export default (state = null, action) => {
  switch (action.type) {
    case types.UPLOAD_CVS:
      return { ...action.info }
    case types.REMOVE_IMPORT_RESULT:
      return null
    default:
      return state
  }
}

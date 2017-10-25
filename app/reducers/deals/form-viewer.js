import types from '../../constants/deals'

export default (state = {}, action) => {
  switch (action.type) {
    case types.SET_FORM_VIEWER:
      return {
        task: action.task,
        file: action.file,
        title: action.title
      }

    default:
      return state
  }
}

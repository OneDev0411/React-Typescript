import types from '../../constants/brandConsole'

export default (state = {}, action) => {
  switch (action.type) {
    case types.GET_MEMBERS:
      if (action.members)
        return {
          ...state,
          [action.role_id]: action.members
        }
      return state
    case types.ADD_MEMBER:
      return {
        ...state,
        [action.role_id]: action.members
      }
    default:
      return state
  }
}

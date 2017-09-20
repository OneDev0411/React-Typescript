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
        [action.roleId]: action.members
      }
    case types.DELETE_MEMBER: {
      let stateClone = state[action.role.id].slice()
      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.member_id) {
          stateClone.splice(i, 1)
          break
        }
      }
      return {
        ...state,
        [action.role.id]: stateClone
      }
    }
    default:
      return state
  }
}

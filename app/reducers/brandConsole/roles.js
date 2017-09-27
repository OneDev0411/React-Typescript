import types from '../../constants/brandConsole'

export default (state = [], action) => {
  switch (action.type) {
    case types.GET_ROLES:
      if (action.roles) {
        return action.roles
      }
      return state
    case types.ADD_ROLE:
      return state.concat(action.role)
    case types.EDIT_ROLE: {
      let stateClone = state.slice()
      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.role.id) {
          stateClone[i] = action.role
          break
        }
      }
      return stateClone
    }
    case types.DELETE_ROLE: {
      let stateClone = state.slice()
      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.role_id) {
          stateClone.splice(i, 1)
          break
        }
      }
      return stateClone
    }
    default:
      return state
  }
}

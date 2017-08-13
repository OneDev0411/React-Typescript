import types from '../../constants/brandConsole'

export default (state = [], action) => {
  switch (action.type) {

    case types.GET_ROLES:
      if (action.roles) {
        return action.roles
      }
      return state
    case types.ADD_ROLE:
      return state.concat(action)
    default:
      return state
  }
}

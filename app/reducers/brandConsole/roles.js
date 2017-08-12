import types from '../../constants/brandConsole'

export default (state = [], action) => {
  switch (action.type) {

    case types.GET_ROLES:
      if (action.roles)
        return action.roles
      return state
    default:
      return state
  }
}

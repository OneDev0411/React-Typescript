import types from '../../constants/brandConsole'

export default (state = [], action) => {
  switch (action.type) {

    case types.GET_BRANDS:
      if (action.brands) {
        return action.brands
      }
      return state
    default:
      return state
  }
}

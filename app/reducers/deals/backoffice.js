import types from '../../constants/deals'

export default (state = false, action) => {
  switch (action.type) {
    case types.IS_BACK_OFFICE:
      return action.status

    default:
      return state
  }
}

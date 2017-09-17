import types from '../../constants/confirmation'

export default (state = {}, action) => {
  switch (action.type) {
    case types.SHOW_CONFIRMATION:
      return {
        show: true,
        ...action.data
      }

    case types.HIDE_CONFIRMATION:
      return {
        show: false
      }

    default:
      return state
  }
}

import types from '../../constants/contact'


export default (state = null, action) => {
  switch (action.type) {
    case types.GET_TAGS:
      return action.tags

    default:
      return state
  }
}

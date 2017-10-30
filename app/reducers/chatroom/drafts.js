import types from '../../constants/chatroom'

export default (state = {}, action) => {
  switch (action.type) {
    case types.INSERT_DRAFT:
      return {
        ...state,
        [action.draft.roomId]: action.draft.message
      }
    default:
      return state
  }
}

import types from '../../constants/chatroom'

export default (state = false, action) => {
  switch (action.type) {
    case types.CHANGE_ACTIVE_ROOM:
      return action.roomId || false

    default:
      return state
  }
}

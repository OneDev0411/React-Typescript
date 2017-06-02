import types from '../../constants/chatroom'

export default function (roomId) {
  return {
    type: types.CHANGE_ACTIVE_ROOM,
    roomId
  }
}

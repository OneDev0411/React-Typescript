import _ from 'underscore'
import Chatroom from '../../models/Chatroom'
import types from '../../constants/chatroom'

function _getRooms (rooms) {
  return {
    type: types.GET_ROOMS,
    rooms
  }
}

export function getRooms(user) {
  return async (dispatch) => {
    const response = await Chatroom.getRooms(user)
    const rooms = _.indexBy(response.body.data, 'id')
    dispatch(_getRooms(rooms))
  }
}

export function changeActiveRoom(roomId) {
  return {
    type: types.CHANGE_ACTIVE_ROOM,
    roomId
  }
}

export function updateRoomNotifications(roomId) {

}

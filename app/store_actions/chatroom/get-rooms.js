import _ from 'underscore'
import Chatroom from '../../models/Chatroom'
import types from '../../constants/chatroom'

function getRooms (rooms) {
  return {
    type: types.GET_ROOMS,
    rooms
  }
}

export default function (user) {
  return async (dispatch) => {
    const response = await Chatroom.getRooms(user)
    const rooms = _.indexBy(response.body.data, 'id')
    dispatch(getRooms(rooms))
  }
}

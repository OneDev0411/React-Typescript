import _ from 'underscore'
import Chatroom from '../../models/Chatroom'
import types from '../../constants/chatroom'
import AppStore from '../../stores/AppStore'
import { addNotification as notify } from 'reapop'

function _getRooms(rooms) {
  return {
    type: types.GET_ROOMS,
    rooms
  }
}

export function addMembersToRoom(room) {
  return {
    type: types.ADD_MEMBERS,
    room
  }
}

export function getRooms(user) {
  return async dispatch => {
    const response = await Chatroom.getRooms(user)
    const { data } = response.body

    dispatch(_getRooms(_.indexBy(data, 'id')))
    return data
  }
}

export function addNewRoom(room) {
  return {
    type: types.CREATE_ROOM,
    room
  }
}

export function createRoom(recipients) {
  return async dispatch => {
    try {
      const room = await Chatroom.createRoom(recipients)
      dispatch(addNewRoom(room))
      return room.id
    } catch(e) {
      dispatch(notify({
        title: 'Can not create room',
        message: e.response ? e.response.body.message : null,
        status: 'error'
      }))

      return null
    }
  }
}

export function updateRoomTime(roomId) {
  return {
    type: types.UPDATE_ROOM_TIME,
    roomId
  }
}

export function fetchAndCreateExistingRoom(roomId) {
  return async dispatch => {
    const room = await Chatroom.getRoomById(roomId)
    dispatch(addNewRoom(room))
  }
}

export function addRecipients(roomId, recipients) {
  return async dispatch => {
    const response = await Chatroom.addMembers(roomId, recipients)
    const room = response.body.data
    dispatch(addMembersToRoom(room))
  }
}

export function removeRoom(roomId) {
  return {
    type: types.REMOVE_ROOM,
    roomId
  }
}

export function acknowledgeRoom(roomId, userId) {
  return {
    type: types.ACKNOWLEDGE_ROOM,
    roomId,
    userId
  }
}

export function changeActiveRoom(roomId) {
  return {
    type: types.CHANGE_ACTIVE_ROOM,
    roomId
  }
}

export function updateRoomNotifications(roomId, message) {
  return {
    type: types.UPDATE_ROOM_NOTIFICATIONS,
    roomId,
    message
  }
}

export function resetRoomNotificationsCounter(roomId) {
  return {
    type: types.RESET_ROOM_NOTIFICATIONS,
    roomId
  }
}

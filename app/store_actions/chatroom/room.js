import _ from 'underscore'
import Chatroom from '../../models/Chatroom'
import types from '../../constants/chatroom'
import AppStore from '../../stores/AppStore'

function _getRooms(rooms) {
  return {
    type: types.GET_ROOMS,
    rooms
  }
}

export function addMembersToRoom(roomId, users) {
  return {
    type: types.ADD_MEMBERS,
    roomId,
    users
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
    const room = await Chatroom.createRoom(recipients)
    dispatch(addNewRoom(room))
    return room.id
  }
}

export function updateRoomTime(roomId) {
  return {
    type: types.UPDATE_ROOM_TIME,
    roomId
  }
}

export function createExistingRoom(roomId) {
  return async dispatch => {
    const room = await Chatroom.getRoomById(roomId)
    dispatch(addNewRoom(room))
  }
}

export function addRecipients(roomId, recipients) {
  return async dispatch => {
    const response = await Chatroom.addMembers(roomId, recipients)
    const room = response.body.data
    dispatch(addMembersToRoom(roomId, room.users))
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

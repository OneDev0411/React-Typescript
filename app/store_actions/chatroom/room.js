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

function _addNewRoom(room) {
  return {
    type: types.CREATE_ROOM,
    room
  }
}

function _leaveRoom(roomId) {
  return {
    type: types.LEAVE_ROOM,
    roomId
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

export function createRoom(recipients) {
  return async dispatch => {
    const room = await Chatroom.createRoom(recipients)
    dispatch(_addNewRoom(room))
    return room.id
  }
}

export function createExistingRoom(roomId) {
  return async dispatch => {
    const room = await Chatroom.getRoomById(roomId)
    dispatch(_addNewRoom(room))
  }
}

export function addRecipients(roomId, recipients) {
  return async dispatch => {
    const response = await Chatroom.addMembers(roomId, recipients)
    const room = response.body.data
    dispatch(addMembersToRoom(roomId, room.users))
  }
}

export function leaveRoom(userId, room) {
  return async dispatch => {
    await Chatroom.leaveRoom(userId, room)
    dispatch(_leaveRoom(room.id))
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

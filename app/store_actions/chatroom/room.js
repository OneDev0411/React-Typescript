import _ from 'underscore'
import Chatroom from '../../models/Chatroom'
import types from '../../constants/chatroom'

function _getRooms (rooms) {
  return {
    type: types.GET_ROOMS,
    rooms
  }
}

function _addNewRoom (room) {
  return {
    type: types.CREATE_ROOM,
    room
  }
}

function _addMembers (roomId, room) {
  return {
    type: types.ADD_MEMBERS,
    roomId,
    room
  }
}

function _leaveRoom(roomId) {
  return {
    type: types.LEAVE_ROOM,
    roomId
  }
}

export function getRooms(user) {
  return async (dispatch) => {
    const response = await Chatroom.getRooms(user)
    const rooms = _.indexBy(response.body.data, 'id')
    dispatch(_getRooms(rooms))
  }
}

export function createRoom(recipients) {
  return async (dispatch) => {
    const room = await Chatroom.createRoom(recipients)
    dispatch(_addNewRoom(room))
    return room.id
  }
}

export function addMembers(roomId, recipients) {
  return async (dispatch) => {
    const response = await Chatroom.addMembers(roomId, recipients)
    dispatch(_addMembers(roomId, response.body.data))
  }
}

export function leaveRoom(userId, room) {
  return async (dispatch) => {
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

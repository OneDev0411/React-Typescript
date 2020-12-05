import _ from 'underscore'

import { addNotification as notify } from 'components/notification'

import Chatroom from '../../models/Chatroom'
import types from '../../constants/chatroom'

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

export function removeMemberFromRoom(roomId, memberId) {
  return {
    type: types.REMOVE_MEMBER,
    roomId,
    memberId
  }
}

export function getRooms(user) {
  return async dispatch => {
    try {
      const rooms = await Chatroom.getRooms(user)

      dispatch(_getRooms(_.indexBy(rooms, 'id')))

      return rooms
    } catch (e) {}
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
    } catch (e) {
      dispatch(
        notify({
          title: 'Can not create room',
          message: e.response ? e.response.body.message : null,
          status: 'error'
        })
      )

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

export function removeMember(roomId, memberId) {
  return async dispatch => {
    const response = await Chatroom.removeMember(roomId, memberId)

    if (
      response &&
      !response.error &&
      response.body &&
      response.body.status === 'success'
    ) {
      dispatch(removeMemberFromRoom(roomId, memberId))
    } else {
      dispatch(
        notify({
          message: response.response.body.message,
          status: 'error'
        })
      )
    }
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

import _ from 'underscore'
import moment from 'moment'
import config from '../../config/public'
import Fetch from '../services/fetch'

const Chatroom = {}


/**
* returns rooms list
*/
Chatroom.getRooms = async function(user = {}) {
  const { access_token } = user

  try {
    const fetchRooms = new Fetch()
      .get('/rooms?associations=user.last_seen_by&limit=1000&sorting_value=Update')

    // required on ssr
    if (access_token)
      fetchRooms.set({ Authorization: `Bearer ${access_token}` })

    return await fetchRooms
  } catch (e) {}
}

/**
* add new room
*/
Chatroom.createRoom = async function(recipients) {

  const members = [].concat(recipients.users, recipients.emails, recipients.phone_numbers)
  const room_type = members.length > 1 ? 'Group' : 'Direct'

  try {
    return await new Fetch()
      .post('/rooms')
      .send({ room_type })
      .send(recipients)

  } catch (e) {
    return null
  }
}

/**
* leave or delete a room
*/
Chatroom.leaveRoom = async function(userId, room) {
  const endpoint = room.room_type === 'Direct' ?
    `/rooms/${room.id}` :
    `/rooms/${room.id}/users/${userId}`

  try {
    return await new Fetch().delete(endpoint)
  } catch (e) {
    return null
  }
}

/**
* add members to a room
*/
Chatroom.addMembers = async function(roomId, recipients) {

  try {
    return await new Fetch()
      .post(`/rooms/${roomId}/users`)
      .send(recipients)

  } catch (e) {
    return null
  }
}

Chatroom.getMessages = async function(id, limit = 20, max_value = null) {
  let endpoint = `/rooms/${id}/messages?limit=${limit}&sorting_value=Creation`

  if (max_value)
    endpoint += `&max_value=${max_value}`

  try {
    const response = await new Fetch().get(endpoint)
    return await response
  } catch (e) {}
}

export default Chatroom

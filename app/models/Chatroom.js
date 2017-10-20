import _ from 'underscore'
import moment from 'moment'
import config from '../../config/public'
import Fetch from '../services/fetch'

const Chatroom = {}

/**
* returns rooms list
*/
Chatroom.getRooms = async function (user = {}) {
  const { access_token } = user

  try {
    const fetchRooms = new Fetch()
      .get('/rooms')
      .query({ 'room_types[]': ['Group', 'Direct'] })
      .query({ associations: 'user.last_seen_by' })
      .query({ limit: '1000' })
      .query({ sorting_value: 'Update' })

    // required on ssr
    if (access_token) {
      fetchRooms.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await fetchRooms
    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* get room by id
*/
Chatroom.getRoomById = async function (roomId) {
  try {
    const response = await new Fetch().get(
      `/rooms/${roomId}?associations=user.last_seen_by`
    )

    return response.body.data
  } catch (e) {}
}

/**
* add new room
*/
Chatroom.createRoom = async function (recipients) {
  const members = [].concat(
    recipients.users,
    recipients.emails,
    recipients.phone_numbers
  )
  const room_type = members.length > 1 ? 'Group' : 'Direct'

  // search room is created before or not
  const room = await Chatroom.searchRoom(recipients)

  if (room) { return room }

  try {
    const response = await new Fetch()
      .post('/rooms')
      .send({ room_type })
      .send(recipients)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
* leave or delete a room
*/
Chatroom.leaveRoom = async function (userId, room) {
  const endpoint =
    room.room_type === 'Direct'
      ? `/rooms/${room.id}`
      : `/rooms/${room.id}/users/${userId}`

  try {
    return await new Fetch().delete(endpoint)
  } catch (e) {
    return null
  }
}

/**
* add members to a room
*/
Chatroom.addMembers = async function (roomId, recipients) {
  try {
    return await new Fetch().post(`/rooms/${roomId}/users`).send(recipients)
  } catch (e) {
    return null
  }
}

Chatroom.getMessages = async function (
  id,
  limit = 20,
  value = null,
  value_type = 'max'
) {
  let endpoint = `/rooms/${id}/messages?limit=${limit}&sorting_value=Creation`

  if (value) {
    let type = `${value_type}_value`
    endpoint += `&${type}=${value}`
  }

  try {
    const response = await new Fetch().get(endpoint)
    return response.body
  } catch (e) {
    throw e
  }
}

Chatroom.uploadAttachment = async function (roomId, file) {
  let endpoint = `/rooms/${roomId}/attachments`

  try {
    return await new Fetch().upload(endpoint).attach(file.name, file)
  } catch (e) {
    console.log(e)
  }
}

Chatroom.searchRoom = async function (recipients) {
  let qs = []
  _.each(recipients, (recp, key) => {
    _.each(recp, item => {
      qs.push(`${key}[]=${item}`)
    })
  })

  // create query string
  const query = qs.join('&')

  try {
    const response = await new Fetch().get(`/rooms/search?${query}&room_types[]=Direct&room_types[]=Group`)
    const rooms = response.body.data.filter(room => room.room_type !== 'Task')

    return rooms.length > 0 ? rooms[0] : null
  } catch (e) {
    return null
  }
}

export default Chatroom

import _ from 'underscore'
import Fetch from '../services/fetch'

/**
 * returns rooms list
 */
export async function getRooms(user = {}) {
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
export async function getRoomById(roomId) {
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
export async function createRoom(recipients) {
  const members = [].concat(
    recipients.users,
    recipients.emails,
    recipients.phone_numbers
  )
  const room_type = members.length > 1 ? 'Group' : 'Direct'

  // search room is created before or not
  const room = await Chatroom.searchRoom(recipients)

  if (room) {
    return room
  }

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
export async function leaveRoom(userId, room) {
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
export async function addMembers(roomId, recipients) {
  try {
    return await new Fetch().post(`/rooms/${roomId}/users`).send(recipients)
  } catch (e) {
    return null
  }
}

/**
 * remove member of a room
 */
export async function removeMember(roomId, memberId) {
  try {
    return await new Fetch().delete(`/rooms/${roomId}/users/${memberId}`)
  } catch (error) {
    return error
  }
}

export async function getMessages(
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

export async function uploadAttachment(roomId, file, fileName = null) {
  const title = fileName || file.name

  try {
    return await new Fetch()
      .upload(`/rooms/${roomId}/attachments`)
      .attach('attachment', file, title)
  } catch (e) {
    return null
  }
}

export async function searchRoom(recipients) {
  let qs = []

  _.each(recipients, (recp, key) => {
    _.each(recp, item => {
      qs.push(`${key}[]=${item}`)
    })
  })

  // create query string
  const query = qs.join('&')

  try {
    const response = await new Fetch().get(
      `/rooms/search?${query}&room_types[]=Direct&room_types[]=Group`
    )
    const rooms = response.body.data.filter(room => room.room_type !== 'Task')

    return rooms.length > 0 ? rooms[0] : null
  } catch (e) {
    return null
  }
}

export default {
  getRooms,
  getRoomById,
  createRoom,
  leaveRoom,
  addMembers,
  removeMember,
  getMessages,
  uploadAttachment,
  searchRoom
}

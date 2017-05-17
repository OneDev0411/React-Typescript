// actions/rooms/get-room-and-messages.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'

export default (user, room) => {
  const params = {
    access_token: user.access_token,
    room_id: room.id
  }
  Room.getMessages(params, (err, res) => {
    const index = _.findIndex(AppStore.data.rooms, { id: room.id })
    AppStore.data.rooms[index].messages = res.data
    AppStore.emitChange()
  })
}

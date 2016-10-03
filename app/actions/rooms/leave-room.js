// actions/leave-room.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
import getRooms from '../user/get-rooms'

export default (user, room) => {
  const params = {
    user: user.id,
    room,
    access_token: user.access_token
  }
  console.log(params)
  Room.removeUser(params, () => {
    delete AppStore.data.deleting_room
    delete AppStore.data.show_delete_room_modal
    delete AppStore.data.show_settings_modal
    AppStore.emitChange()
    getRooms(user)
  })
}
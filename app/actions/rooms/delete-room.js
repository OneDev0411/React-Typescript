// actions/delete-room.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
import getRooms from '../user/get-rooms'

export default (user, id) => {
  const params = {
    id,
    access_token: user.access_token
  }
  Room.delete(params, () => {
    delete AppStore.data.deleting_room
    delete AppStore.data.show_delete_room_modal
    delete AppStore.data.show_settings_modal
    AppStore.emitChange()
    getRooms(user)
  })
}
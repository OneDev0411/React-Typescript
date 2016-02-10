// actions/notifications.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'

export default (user, id, notification) => {
  const params = {
    id,
    notification,
    access_token: user.access_token
  }
  Room.setNotifications(params, () => {
    // Success
    // if (response.status === 'success') {
    //   const room_updated = response.data
    //   const current_room = AppStore.data.current_room
    //   const new_settings = room_updated.notification_settings
    //   // console.log(new_settings)
    //   // current_room.notification_settings = new_settings
    //   // AppStore.data.current_room = current_room
    // }
    // AppStore.emitChange()
  })
}
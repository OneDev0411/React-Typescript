// actions/rooms/add-users.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
export default (user, room, users, emails, phone_numbers) => {
  const params = {
    room_id: room,
    users,
    emails,
    phone_numbers,
    access_token: user.access_token
  }
  if (AppStore.data.brand)
    params.brand = AppStore.data.brand.id
  Room.addUsers(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      delete AppStore.data.users_added
      delete AppStore.data.add_members
      delete AppStore.data.show_add_members_modal
    } else
      AppStore.data.add_users_error = true
    delete AppStore.data.adding_users
    AppStore.emitChange()
  })
}
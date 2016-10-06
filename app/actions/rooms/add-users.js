// actions/rooms/add-users.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
export default (user, room, users, emails, phone_numbers) => {
  const params = {
    room_id: room,
    users,
    emails,
    phone_numbers,
    access_token: user.access_token,
    inviting_user: user.id
  }
  Room.addUsers(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      delete AppStore.data.users_added
      delete AppStore.data.adding_users
      delete AppStore.data.add_members
      delete AppStore.data.show_add_members_modal
      response.data.forEach(invitation => {
        if (invitation.invited_user)
          AppStore.data.current_room.users.push(invitation.invited_user)
      })
      AppStore.emitChange()
    } else {
      AppStore.data.add_users_error = true
      AppStore.emitChange()
    }
  })
}
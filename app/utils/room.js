import config from '../../config/public'
export default {
  getFirstNameString(room, current_user) {
    const users = room.users
    let first_name_string = ''
    const total_other_users = users.length - 1
    users.forEach((user, i) => {
      if (current_user.id !== user.id) {
        first_name_string += user.first_name
        if (i > 0 && i !== total_other_users)
          first_name_string += ', '
      }
    })
    return first_name_string
  }
}
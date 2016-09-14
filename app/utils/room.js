import config from '../../config/public'
export default {
  getDisplayNameString(room, current_user) {
    const users = room.users
    let display_name_list = ''
    if (!users)
      return
    const total_other_user_indexes = users.length - 1
    users.forEach((user, i) => {
      if (current_user.id !== user.id) {
        let display_name = user.first_name
        if (!display_name)
          display_name = user.display_name
        if (!display_name)
          display_name = user.phone_number
        display_name_list += display_name
        if (total_other_user_indexes > 1 && i < total_other_user_indexes)
          display_name_list += ', '
      }
    })
    return display_name_list
  }
}
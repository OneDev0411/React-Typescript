export const getUserTitle = user =>
  [user.first_name, user.last_name].filter(i => i != null).join(' ')

export const getUserInfo = user =>
  [user.email, user.phone_numner].filter(i => i != null).join(', ')

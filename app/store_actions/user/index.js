import { UPDATE_USER } from '../../constants/user'

export const updateUser = user => ({
  user,
  type: UPDATE_USER
})

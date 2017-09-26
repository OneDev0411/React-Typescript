import Fetch from '../../../services/fetch'

/**
 * Update user password with its old and new password
 * @param {object}
 */
const changePassword = async params => {
  try {
    const response = await new Fetch()
      .patch('/users/self/password')
      .send(params)
  } catch ({ status }) {
    throw status
  }
}

export default changePassword

import Fetch from '../../../../services/fetch'

/**
 * Reset password by email
 * @param {object} contain old and new password
 */
const updatePassword = async params => {
  try {
    const response = await new Fetch().patch('/users/password').send(params)
    return response.statusCode
  } catch ({ status }) {
    throw status
  }
}

export default updatePassword

import Fetch from '../../../../services/fetch'
/**
 * Reset password by email
 * @param {object} contain email address { email: <email> }
 */
const resetPassword = async email => {
  try {
    const response = await new Fetch().post('/users/reset_password').send(email)
    return response.body.data
  } catch (error) {
    throw error
  }
}

export default resetPassword

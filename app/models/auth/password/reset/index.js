import Fetch from '../../../../services/fetch'

/**
 * Reset password by email
 * @param {String} email email address.
 */
const resetPassword = async email => {
  try {
    const response = await new Fetch()
      .post('/users/reset_password')
      .send({ email })

    return response
  } catch (error) {
    throw error
  }
}

export default resetPassword

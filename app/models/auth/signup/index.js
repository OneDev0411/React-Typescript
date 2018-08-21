import Fetch from '../../../services/fetch'
import { randomString } from '../../../utils/helpers'

const signupShadow = async email => {
  const user = {
    email,
    last_name: '',
    is_shadow: true,
    first_name: email,
    user_type: 'Client',
    grant_type: 'password',
    password: randomString(9)
  }

  try {
    const response = await new Fetch({ proxy: true })
      .post('/users')
      .set({ 'x-auth-mode': 'client_id' })
      .send(user)

    const { type, email_confirmed } = response.body.data

    if (type === 'user_reference' && !email_confirmed) {
      const error = { http: 202 }

      throw error
    }

    return response.statusCode
  } catch (error) {
    if (error.http) {
      throw error.http
    } else if (error.response) {
      throw error.response.statusCode
    }

    throw error
  }
}

export default signupShadow

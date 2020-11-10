import Fetch from 'services/fetch'

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
    const response = await new Fetch()
      .post('/api/users')
      .set({ 'x-auth-mode': 'client_id' })
      .send(user)

    const { type, email_confirmed } = response.body.data

    if (type === 'user_reference' && !email_confirmed) {
      return 202
    }

    return response.status
  } catch (error) {
    if (error.http) {
      throw error.http
    } else if (error.response) {
      throw error.response.status
    }

    throw error
  }
}

export default signupShadow

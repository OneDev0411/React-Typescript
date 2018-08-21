import Fetch from '../../../services/fetch'

const signin = async userInfo => {
  const requestBody = {
    ...userInfo,
    grant_type: 'password'
  }

  try {
    const response = await new Fetch({ proxy: true })
      .post('/oauth2/token')
      .set({ 'x-auth-mode': 'client_id' })
      .send(requestBody)
    const { data, access_token, refresh_token } = response.body

    return {
      ...data,
      access_token,
      refresh_token
    }
  } catch ({ status }) {
    throw status
  }
}

export default signin

import Fetch from 'services/fetch'

const signin = async userInfo => {
  const requestBody = {
    grant_type: 'password',
    ...userInfo
  }

  try {
    const response = await new Fetch()
      .post('/api/oauth2/token')
      .set({
        'x-auth-mode': 'client_id'
      })
      .send(requestBody)

    const { data, access_token, refresh_token, expires_in } = response.body

    return {
      ...data,
      access_token,
      refresh_token,
      expires_in
    }
  } catch ({ status }) {
    throw status
  }
}

export default signin

import axios from 'axios'

import config from 'config'

const signin = async userInfo => {
  const requestBody = {
    grant_type: 'password',
    ...userInfo
  }

  try {
    const response = await axios.post(
      `${config.proxy.url}/api/oauth2/token`,
      requestBody,
      {
        headers: {
          'x-auth-mode': 'client_id'
        }
      }
    )

    const { data, access_token, refresh_token, expires_in } = response.data

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

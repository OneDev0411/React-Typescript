import Fetch from '../../../services/fetch'
import config from '../../../../config/private'

const signin = async userInfo => {
  const requestBody = {
    ...userInfo,
    grant_type: 'password',
    client_id: config.api.client_id,
    client_secret: config.api.client_secret
  }
  try {
    const response = await new Fetch().post('/oauth2/token').send(requestBody)
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

import axios, { AxiosResponse } from 'axios'

import config from '../../../config'

export async function requestRefreshToken(refreshToken: string) {
  try {
    const response: AxiosResponse = await axios({
      method: 'POST',
      url: `${config.api_url}/oauth2/token`,
      data: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: config.client_id,
        client_secret: config.client_secret
      }
    })

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expire_date: new Date().getTime() + response.data.expires_in * 1000
    }
  } catch (e) {
    throw e
  }
}

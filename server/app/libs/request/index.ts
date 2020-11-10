import axios, { AxiosRequestConfig } from 'axios'
import curlirize from 'axios-curlirize'

import config from '../../../config'

export function request(requestConfig: AxiosRequestConfig) {
  curlirize(axios)

  return axios({
    ...requestConfig,
    url: `${config.api_url}${requestConfig.url}`
  })
}

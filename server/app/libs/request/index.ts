import axios, { AxiosRequestConfig } from 'axios'

import config from '../../../config'

axios.interceptors.response.use(
  response => {
    const method = (response.config.method || 'GET').toUpperCase()
    const duration =
      new Date().getTime() - response.config.headers['x-request-time']

    console.log(
      `(${duration}ms) HTTP\t${response.status} ${response.statusText}\t${method}\t${response.config.url}`
    )

    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export function request(requestConfig: AxiosRequestConfig) {
  return axios({
    timeout: 30000,
    ...requestConfig,
    url: `${config.api_url}${requestConfig.url}`
  })
}

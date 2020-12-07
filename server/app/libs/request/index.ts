import { Request } from 'express'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

import { requestRefreshToken } from '../refresh-token'

import config from '../../../config'

import type { RequestWithSession } from '../../../types'

export function request(req: Request, requestConfig: AxiosRequestConfig) {
  const instance = axios.create()

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      log(response)

      return response
    },
    async (error: AxiosError) => {
      const originalRequest: AxiosRequestConfig & { retry?: boolean } =
        error.config

      const session = (<RequestWithSession>req).session

      if (
        session.user &&
        error.response?.status === 401 &&
        error.response?.data.message === 'Expired Token' &&
        !originalRequest.retry
      ) {
        originalRequest.retry = true

        try {
          const nextSession = await requestRefreshToken(
            session.user.refresh_token
          )

          originalRequest.headers.authorization = `Bearer ${nextSession.access_token}`

          req.session!.user = nextSession

          return axios(originalRequest)
        } catch (e) {}
      }

      return Promise.reject(error)
    }
  )

  return instance({
    timeout: 30000,
    ...requestConfig,
    url: `${config.api_url}${requestConfig.url}`
  })
}

/**
 * Logs the Response
 *
 * @param response The [[AxiosResponse | response]]
 */
function log(response: AxiosResponse) {
  const method = (response.config.method || 'GET').toUpperCase()
  const duration =
    new Date().getTime() - response.config.headers['x-request-time']

  console.log(
    `(${duration}ms) HTTP\t${response.status} ${response.statusText}\t${method}\t${response.config.url}`
  )
}

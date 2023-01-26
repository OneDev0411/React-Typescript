import http from 'http'
import https from 'https'

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Request } from 'express'

import config from '../../../config'
import type { RequestWithSession } from '../../../types'
import { requestRefreshToken } from '../refresh-token'

const AGENT_CONFIG = Object.freeze({
  keepAlive: true,
  maxSockets: 50,
  maxTotalSockets: 200
})

export function request(req: Request, requestConfig: AxiosRequestConfig) {
  const instance = axios.create({
    httpAgent: new http.Agent(AGENT_CONFIG),
    httpsAgent: new https.Agent(AGENT_CONFIG)
  })

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      log(response)

      return response
    },
    async (error: AxiosError<{ message?: string }>) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        retry?: boolean
      }

      const session = (<RequestWithSession>req).session

      if (
        session.user &&
        error.response?.status === 401 &&
        error.response?.data?.message === 'Expired Token' &&
        !originalRequest.retry
      ) {
        originalRequest.retry = true

        try {
          const nextSession = await requestRefreshToken(
            session.user.refresh_token
          )

          if (originalRequest.headers) {
            originalRequest.headers.authorization = `Bearer ${nextSession.access_token}`
          }

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
    response?.config?.headers && response?.config?.headers['x-request-time']
      ? new Date().getTime() - Number(response.config.headers['x-request-time'])
      : null

  const durationPart = duration ? `(${duration}ms)` : ''
  const statusPart = `HTTP\t${response.status} ${response.statusText}`

  console.log(
    `${durationPart} ${statusPart}\t${method}\t${response.config.url}`
  )
}

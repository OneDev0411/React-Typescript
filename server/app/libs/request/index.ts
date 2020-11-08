import { Request, Response } from 'express'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import curlirize from 'axios-curlirize'

import config from '../../../../config/public'

const ALLOWED_HEADERS = [
  'x-auth-mode',
  'x-real-agent',
  'user-agent',
  'content-type',
  'authorization'
]

export function request(
  req: Request,
  res: Response,
  requestConfig: AxiosRequestConfig
) {
  const { access_token: accessToken } = req.query
  const headers = Object.entries({
    ...requestConfig.headers,
    'content-type': 'application/json',
    'user-agent': config.app_name,
    'x-rechat-brand': req.headers['x-rechat-brand'],
    'x-real-agent': req.headers['user-agent'] || req.headers['x-user-agent'],
    authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    ...requestConfig.headers
  }).reduce((acc, [key, value]) => {
    if (
      ALLOWED_HEADERS.includes(key.toLowerCase()) === false ||
      value === undefined ||
      value === null
    ) {
      return acc
    }

    return {
      ...acc,
      [key]: value
    }
  }, {})

  curlirize(axios)

  const request = axios({
    ...requestConfig,
    url: `${config.api_url}${requestConfig.url}`,
    headers
  })

  request.catch((e: AxiosError) => {
    res.status(e.response?.status || 500)

    if (requestConfig.responseType === 'stream') {
      // eslint-disable-next-line
       e.response?.data.pipe(res)

      return
    }

    throw e
  })

  return request
}

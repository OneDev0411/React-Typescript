import { Request } from 'express'

import config from '../../../config'
import { getAccessToken } from '../get-access-token'

const ALLOWED_HEADERS = [
  'accept-encoding',
  'x-auth-mode',
  'x-real-agent',
  'x-request-time',
  'user-agent',
  'content-type',
  'authorization'
]

export function getParsedHeaders(req: Request) {
  return Object.entries({
    ...req.headers,
    'content-type': 'application/json',
    'user-agent': config.app_name,
    'x-rechat-brand': req.headers['x-rechat-brand'],
    'x-real-agent': req.headers['user-agent'] || req.headers['x-user-agent'],
    'x-request-time': new Date().getTime(),
    authorization: getAccessToken(req)
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
}

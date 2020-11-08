import { Request } from 'express'

import config from '../../../../config/public'

const ALLOWED_HEADERS = [
  'x-auth-mode',
  'x-real-agent',
  'user-agent',
  'content-type',
  'authorization'
]

export function getParsedHeaders(req: Request) {
  const { access_token: accessToken } = req.query

  return Object.entries({
    ...req.headers,
    'content-type': 'application/json',
    'user-agent': config.app_name,
    'x-rechat-brand': req.headers['x-rechat-brand'],
    'x-real-agent': req.headers['user-agent'] || req.headers['x-user-agent'],
    authorization: accessToken ? `Bearer ${accessToken}` : undefined
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

import { Request } from 'express'

import { RequestWithSession } from '../../../types'

export function getAccessToken(req: Request): string | undefined {
  const request = <RequestWithSession>req

  if (request.headers.authorization) {
    return request.headers.authorization
  }

  if (request.query.access_token) {
    return `Bearer ${request.query.access_token}`
  }

  if (request.session?.user) {
    return `Bearer ${request.session.user.access_token}`
  }

  return undefined
}

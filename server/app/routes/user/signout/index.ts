import { Response } from 'express'

import { RequestWithSession } from '../../../../types'

export default async (req: RequestWithSession, res: Response) => {
  if (!req.session?.user) {
    res.redirect('/')

    return
  }

  const { redirectFromSignout, redirect_to, ...queryParams } = req.query
  let redirect = redirectFromSignout || redirect_to || '/signin'

  if (queryParams) {
    redirect += createParams(queryParams as Record<string, string>)
  }

  req.session.user = null

  res.redirect(redirect as string)
}

function createParams(params: Record<string, string>) {
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')

  if (queryString.length > 0) {
    return `?${queryString}`
  }

  return ''
}

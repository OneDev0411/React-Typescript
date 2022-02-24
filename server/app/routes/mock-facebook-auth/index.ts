// TODO: This is just a mock and must be removed when the actual API is ready

import { Request, Response } from 'express'

function errorLink(): string {
  const errorCodes = [
    'OAuthException',
    'Unauthorized',
    'FacebookPageIsNotConnected',
    'InstagramIsNotConnected',
    'Unknown'
  ]

  return `/api/facebook/auth-result?error=${
    errorCodes[Math.floor(Math.random() * errorCodes.length)]
  }`
}

function successLink(): string {
  return '/api/facebook/auth-result'
}

function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default async (req: Request, res: Response) => {
  const isError = Math.random() > 0.5

  await waitFor(1500)

  if (isError) {
    res.redirect(errorLink())

    return
  }

  res.redirect(successLink())
}

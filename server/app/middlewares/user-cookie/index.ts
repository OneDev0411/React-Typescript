import { NextFunction, Request, Response } from 'express'

export function userCookie(req: Request, res: Response, next: NextFunction) {
  res.cookie(
    'user',
    JSON.stringify({
      ip:
        req.headers['cf-connecting-ip'] ??
        req.headers['x-forwarded-for'] ??
        req.ip
    })
  )

  next()
}

import { Request, Response, NextFunction } from 'express'
import check from 'ofac-embargo-list'

export function checkOFACEmbargo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userIP =
    (req.headers['cf-connecting-ip'] as string) ??
    (req.headers['x-forwarded-for'] as string) ??
    req.ip

  if (check(userIP)) {
    next()

    return
  }

  res.end('Access Denied')
}

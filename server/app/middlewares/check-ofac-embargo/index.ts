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

  // TODO: this is just for the sake of test on server,
  // Warn: please remove this line after testing

  console.log({
    userIP,
    reqIP: req.ip,
    cfIP: req.headers['cf-connecting-ip'],
    xForward: req.headers['x-forwarded-for'],
    check: check(userIP)
  })

  if (check(userIP)) {
    next()

    return
  }

  res.end('Access Denied')
}

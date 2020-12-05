import { Request, Response, NextFunction } from 'express'

const UNSUPPORTED_URL = '/unsupported'

export function checkBrowser(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent']

  if (req.path.includes(UNSUPPORTED_URL)) {
    next()

    return
  }

  // detects old IE browsers
  if (userAgent?.includes('MSIE ') || userAgent?.includes('Trident/')) {
    res.redirect(UNSUPPORTED_URL)

    return
  }

  next()
}

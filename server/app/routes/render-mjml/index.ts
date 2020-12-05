import { Request, Response, NextFunction } from 'express'
import mjml2html from 'mjml'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send(mjml2html(req.body.mjml))
  } catch (e) {
    res.status(400)
    res.send('')
  }
}

import { Response } from 'express'

import { RequestWithSession } from '../../../../types'

export default async (req: RequestWithSession, res: Response) => {
  req.session.user = null

  res.status(200)
  res.json({})
}

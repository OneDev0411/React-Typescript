import { Response } from 'express'

import { RequestWithSession } from '../../../../types'

export default async (req: RequestWithSession, res: Response) => {
  if (!req.session?.user) {
    res.status(500).send()

    return
  }

  req.session.user = null

  res.status(200)
  res.json({})
}

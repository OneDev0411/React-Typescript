import type { Request, Response } from 'express'

import { LONG_RESPONSE_TIMEOUT_MS } from '../constants'

import { getVideoboltVideos } from './helpers'

export default async (req: Request, res: Response) => {
  try {
    if (!req.session?.user) {
      res.status(403)
      res.send('')

      return
    }

    req.setTimeout(LONG_RESPONSE_TIMEOUT_MS)

    const email: string = req.body.email

    if (!email) {
      res.json({ videos: [] })

      return
    }

    const videos = await getVideoboltVideos(email)

    res.json({ videos })
  } catch (error) {
    console.error('Error getting videobolt videos', { error })
    res.status(500)
    res.json({
      error: 'Error getting videos',
      details: error.toString()
    })
  }
}

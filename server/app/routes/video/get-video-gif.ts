import type { Request, Response } from 'express'
import superagent from 'superagent'
import { v4 as uuidv4 } from 'uuid'

import { LONG_RESPONSE_TIMEOUT_MS } from '../constants'
import {
  TRANSCODER_GIF_PRESET_ID,
  TRANSCODER_PIPELINE_ID
} from '../youtube/constants'
import {
  createTranscodeJob,
  getS3UrlFromTranscodeJob,
  uploadVideoToS3
} from '../youtube/helpers'

export default async (req: Request, res: Response) => {
  if (!req.session?.user) {
    res.status(403)
    res.send('')

    return
  }

  req.setTimeout(LONG_RESPONSE_TIMEOUT_MS)

  const url: string = req.body.url

  if (!url) {
    res.status(400)
    res.json({
      error: 'Invalid URL'
    })

    return
  }

  try {
    const videoDownloadResponse = await superagent
      .get(url)
      .responseType('arraybuffer')
    const video = videoDownloadResponse.body

    if (!video) {
      res.status(500)
      res.json({
        error: `Error downloading video: ${url}`
      })

      return
    }

    const videoKey = uuidv4()

    await uploadVideoToS3(video, videoKey)

    const transcodeJob = await createTranscodeJob(
      videoKey,
      TRANSCODER_PIPELINE_ID,
      TRANSCODER_GIF_PRESET_ID
    )

    if (!transcodeJob) {
      res.status(500)
      res.json({
        error: `Error creating transcode job: ${url}`
      })

      return
    }

    const gifUrl = await getS3UrlFromTranscodeJob(transcodeJob)

    if (!gifUrl) {
      res.status(500)
      res.json({
        error: `Error getting gif url: ${url}`
      })

      return
    }

    res.json({ url: gifUrl })
  } catch (error) {
    console.error(error)
    res.status(500)
    res.json({
      error: `Error creating gif: ${url}`,
      details: error.toString()
    })
  }
}

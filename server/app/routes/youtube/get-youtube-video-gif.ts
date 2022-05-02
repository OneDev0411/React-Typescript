import type { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { LONG_RESPONSE_TIMEOUT_MS } from '../constants'

import { TRANSCODER_GIF_PRESET_ID, TRANSCODER_PIPELINE_ID } from './constants'
import {
  createTranscodeJob,
  downloadFirstFewSecondsOfYouTubeVideo,
  getUrlMetadata,
  uploadVideoToS3,
  getS3UrlFromTranscodeJob,
  isValidYouTubeUrl
} from './helpers'

export default async (req: Request, res: Response) => {
  try {
    if (!req.session?.user) {
      res.status(403)
      res.send('')

      return
    }

    req.setTimeout(LONG_RESPONSE_TIMEOUT_MS)

    const url: string = req.body.url

    if (!isValidYouTubeUrl) {
      res.status(400)
      res.json({
        error: 'Invalid URL'
      })

      return
    }

    const metadata = await getUrlMetadata(url)

    const videoId = `${metadata.videoDetails.videoId}_${uuidv4()}`
    const downloadedVideo = await downloadFirstFewSecondsOfYouTubeVideo(
      metadata
    )

    if (!downloadedVideo) {
      res.status(500)
      res.json({
        error: 'Error downloading video'
      })

      return
    }

    await uploadVideoToS3(downloadedVideo, videoId)

    const transcodeJob = await createTranscodeJob(
      videoId,
      TRANSCODER_PIPELINE_ID,
      TRANSCODER_GIF_PRESET_ID
    )

    if (!transcodeJob) {
      res.status(500)
      res.json({
        error: 'Error creating transcode job'
      })

      return
    }

    const gifUrl = await getS3UrlFromTranscodeJob(transcodeJob)

    if (!gifUrl) {
      res.status(500)
      res.json({
        error: 'Error getting gif url'
      })

      return
    }

    res.json({ url: gifUrl })
  } catch (error) {
    console.error(error)
    res.status(500)
    res.json({
      error: 'Error creating gif',
      details: error.toString()
    })
  }
}

import { S3, ElasticTranscoder } from 'aws-sdk'
import { Request } from 'express'
import superagent from 'superagent'
import ytdl, { videoInfo, videoFormat } from 'ytdl-core'

import config from '../../../config'
import { request } from '../../libs/request'
import { getParsedHeaders } from '../../utils/parse-headers'

import { AWS_REGION, TEN_MEGA_BYTES, TRANSCODER_BUCKET_NAME } from './constants'

const S3_CLIENT = new S3({
  accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.aws_secret_access_key,
  region: AWS_REGION
})

const TRANSCODER_CLIENT = new ElasticTranscoder({
  accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.aws_secret_access_key,
  region: AWS_REGION
})

export function getUrlMetadata(url: string): Promise<videoInfo> {
  return ytdl.getInfo(url)
}

function selectYouTubeVideoStreamForDownload(info: videoInfo): videoFormat {
  const mp4Formats = info.formats.filter(
    format => format.hasVideo && format.hasAudio && format.container === 'mp4'
  )
  const video =
    mp4Formats.find(format => format.qualityLabel === '480p') ?? mp4Formats[0]

  return video
}

function getApproximateByteSizeOfEachSecond(video: videoFormat): number {
  return video.averageBitrate ? video.averageBitrate / 8 : 0
}

export async function downloadFirstFewSecondsOfYouTubeVideo(
  info: videoInfo,
  seconds: number = 10
): Promise<superagent.Response | undefined> {
  try {
    const selectedStream = selectYouTubeVideoStreamForDownload(info)

    const byteSizeOfEachSecond =
      getApproximateByteSizeOfEachSecond(selectedStream)
    const bytesToDownload = byteSizeOfEachSecond
      ? Math.round(byteSizeOfEachSecond * seconds)
      : TEN_MEGA_BYTES

    const range = `bytes=0-${bytesToDownload}`

    const response = await superagent
      .get(selectedStream.url)
      .set('Range', range)

    return response.body
  } catch (err) {
    console.error('Error downloading video', err)
  }
}

export async function uploadVideoToS3(
  video: superagent.Response,
  key: string
): Promise<S3.PutObjectOutput | undefined> {
  try {
    const nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    const result = await S3_CLIENT.putObject({
      Bucket: TRANSCODER_BUCKET_NAME,
      Key: `${key}.mp4`,
      Body: video,
      Expires: nextWeek
    }).promise()

    return result
  } catch (err) {
    console.error('Error uploading video to S3', err)
  }
}

export async function createTranscodeJob(
  key: string,
  pipelineId: string,
  presetId: string
): Promise<ElasticTranscoder.Job | undefined> {
  try {
    const job = await TRANSCODER_CLIENT.createJob({
      PipelineId: pipelineId,
      Input: {
        Key: `${key}.mp4`,
        TimeSpan: {
          StartTime: '0:00:00',
          Duration: '0:00:10'
        },
        FrameRate: '24'
      },
      Outputs: [
        {
          Key: `${key}.gif`,
          PresetId: presetId,
          Watermarks: [
            {
              InputKey: 'play-icon.png',
              PresetWatermarkId: 'Center'
            }
          ]
        }
      ]
    }).promise()

    return job.Job
  } catch (err) {
    console.error('Error creating transcode job', err)
  }
}

export async function getS3UrlFromTranscodeJob(
  job: ElasticTranscoder.Job
): Promise<string | undefined> {
  const key = job.Output!.Key

  let remainingAttempts = 10

  return new Promise((resolve, reject) => {
    const checkIfJobIsFinished = async () => {
      try {
        const result = await TRANSCODER_CLIENT.waitFor('jobComplete', {
          Id: job.Id!,
          $waiter: {
            delay: 3,
            maxAttempts: 10
          }
        }).promise()

        if (result.Job?.Status === 'Error') {
          return reject(new Error('Transcoding job failed'))
        }

        if (result.Job?.Status === 'Complete') {
          const url = `https://${TRANSCODER_BUCKET_NAME}.s3.amazonaws.com/${key}`

          return resolve(url)
        }

        if (remainingAttempts > 0) {
          remainingAttempts -= 1
          setTimeout(checkIfJobIsFinished, 1000)
        } else {
          reject(
            new Error(
              `Transcoding job timed out. Job ${result.Job?.Id}, status: ${result.Job?.Status}`
            )
          )
        }
      } catch (err) {
        reject(err)
      }
    }

    checkIfJobIsFinished()
  })
}

export function isValidYouTubeUrl(url: string): boolean {
  return !!url && ytdl.validateURL(url)
}

export function isValidTemplateId(templateId: string): boolean {
  return !!templateId
}

export async function uploadGifOnAPI(
  req: Request,
  url: string,
  templateId: string
): Promise<any> {
  try {
    const response = await request(req, {
      headers: getParsedHeaders(req),
      url: '/templates/assets',
      method: 'POST',
      data: {
        url,
        templateId
      }
    })

    console.log(response)
  } catch (err) {
    console.error('Error uploading gif to API', err)
  }
}

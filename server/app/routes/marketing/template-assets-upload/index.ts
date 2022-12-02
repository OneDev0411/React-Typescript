import { Blob } from 'buffer'

import { AxiosError, AxiosResponse } from 'axios'
import { Request, Response } from 'express'
import FormData from 'form-data'
import sharp from 'sharp'

import { request } from '../../../libs/request'
import { getParsedHeaders } from '../../../utils/parse-headers'

export default async (req: Request & { files?: any }, res: Response) => {
  const { template } = req.body

  if (!req.files) {
    res.status(400)
  }

  const attachment = req.files.attachment

  const resizedImage = await sharp(attachment.data)
    .resize({ width: 800 })
    .toBuffer()

  const file = new Blob([resizedImage])

  const data = new FormData()

  data.append('attachment', file, { filename: attachment.name })
  data.append('template', template)

  //   console.log({ resizedImage, data })

  //   res.type('png')
  //   res.send(resizedImage)

  request(req, {
    responseType: 'stream',
    method: 'post',
    url: '/templates/assets',
    headers: {
      ...getParsedHeaders(req),
      'Content-Type': 'multipart/form-data'
    },
    data
  })
    .then((response: AxiosResponse) => {
      res.set(response.headers)
      res.status(response.status)
      response.data.pipe(res)
    })
    .catch((e: AxiosError) => {
      res.status(e.response?.status || 400)
      e.response && e.response.data.pipe(res)
    })
}

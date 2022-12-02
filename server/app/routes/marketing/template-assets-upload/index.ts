import { AxiosError, AxiosResponse } from 'axios'
import { Request, Response } from 'express'
import FormData from 'form-data'
import sharp from 'sharp'

import { request } from '../../../libs/request'
import { getParsedHeaders } from '../../../utils/parse-headers'

export default async (req: Request, res: Response) => {
  const { template } = req.body
  const file = req.file

  if (!file) {
    res.status(400)

    return
  }

  const resizedImage = await sharp(file.buffer)
    .resize({ width: 800 })
    .toBuffer()

  const data = new FormData()

  data.append('attachment', resizedImage, { filename: file.originalname })
  data.append('template', template)

  request(req, {
    responseType: 'stream',
    method: 'post',
    url: '/templates/assets',
    headers: getParsedHeaders(req),
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

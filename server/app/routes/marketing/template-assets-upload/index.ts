import { AxiosResponse } from 'axios'
import { Request, Response } from 'express'
import FormData from 'form-data'
import sharp from 'sharp'

import { RequestError } from '../../../../types'
import { RESIZED_IMAGE_MAX_WIDTH } from '../../../constants'
import { request } from '../../../libs/request'
import { getParsedHeaders } from '../../../utils/parse-headers'

export default async (req: Request, res: Response) => {
  const { template, shouldResize = 0 } = req.body
  const file = req.file

  if (!file) {
    res.status(400)

    return
  }

  let image = file.buffer

  // We want to resize image if shouldResize is present
  if (+shouldResize) {
    const metadata = await sharp(image).metadata()

    // We want to resize image if the width of the image is too large
    if (metadata.width && metadata.width > RESIZED_IMAGE_MAX_WIDTH) {
      const animated = !!metadata.pages

      // disable pixels limit when its animated
      // https://github.com/lovell/sharp/issues/3421
      const limitInputPixels = !animated

      image = await sharp(file.buffer, { animated, limitInputPixels })
        .resize({ width: RESIZED_IMAGE_MAX_WIDTH })
        .toBuffer()
    }
  }

  const data = new FormData()

  data.append('attachment', image, { filename: file.originalname })
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
    .catch((e: RequestError) => {
      res.status(e.response?.status || 400)
      e.response?.data && e.response.data.pipe(res)
    })
}

import axios, { AxiosResponse } from 'axios'
import { Request, Response, NextFunction } from 'express'

import { RequestError } from '../../../types'
import { getParsedHeaders } from '../../utils/parse-headers'

export default async (req: Request, res: Response, next: NextFunction) => {
  const urlAddress = Buffer.from(req.params.url, 'base64').toString('binary')

  axios({
    responseType: 'stream',
    headers: getParsedHeaders(req),
    url: urlAddress
  })
    .then((response: AxiosResponse) => {
      res.set(response.headers)
      response.data.pipe(res)
    })
    .catch((e: RequestError) => {
      res.status(e.response?.status || 400)
      e.response?.data && e.response.data.pipe(res)
    })
}

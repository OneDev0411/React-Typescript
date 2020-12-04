import { Request, Response, NextFunction } from 'express'
import axios, { AxiosError, AxiosResponse } from 'axios'

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
    .catch((e: AxiosError) => {
      res.status(e.response?.status || 400)
      e.response && e.response.data.pipe(res)
    })
}

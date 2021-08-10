import { AxiosError, AxiosResponse } from 'axios'
import { Request, Response, NextFunction } from 'express'

import config from '../../../../config'
import { request } from '../../../libs/request'
import { getParsedHeaders } from '../../../utils/parse-headers'

export default async (req: Request, res: Response, next: NextFunction) => {
  request(req, {
    method: 'post',
    responseType: 'stream',
    url: '/users',
    headers: getParsedHeaders(req),
    data: {
      ...req.body,
      client_id: config.client_id,
      client_secret: config.client_secret
    }
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

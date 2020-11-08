import { Request, Response, NextFunction } from 'express'

import { AxiosError, AxiosResponse } from 'axios'

import config from '../../../../../config/private'

import { getParsedHeaders } from '../../../utils/parse-headers'
import { request } from '../../../libs/request'

export default async (req: Request, res: Response, next: NextFunction) => {
  request({
    method: 'post',
    responseType: 'stream',
    url: '/oauth2/token',
    headers: getParsedHeaders(req),
    data: {
      ...req.body,
      client_id: config.api.client_id,
      client_secret: config.api.client_secret
    }
  })
    .then((response: AxiosResponse) => {
      response.data.pipe(res)
    })
    .catch((e: AxiosError) => {
      res.status(e.response?.status || 400)
      e.response && e.response.data.pipe(res)
    })
}

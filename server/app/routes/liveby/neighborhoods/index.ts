import { getParsedHeaders } from 'app/utils/parse-headers'
import { AxiosError, AxiosResponse } from 'axios'
import { Request, Response, NextFunction } from 'express'

import { request } from '../../../libs/request'

import {
  API_KEY,
  API_CLIENT_ID,
  REQUEST_TIMEOUT_MS,
  NEIGHBORHOODS_API_URL
} from '../constants'

export default async (req: Request, res: Response, next: NextFunction) => {
  request({
    method: 'POST',
    responseType: 'stream',
    timeout: REQUEST_TIMEOUT_MS,
    url: NEIGHBORHOODS_API_URL,
    headers: {
      ...getParsedHeaders(req),
      'X-API-CLIENTID': API_CLIENT_ID,
      'X-API-KEY': API_KEY
    },
    data: req.body
  })
    .then((response: AxiosResponse) => {
      response.data.pipe(res)
    })
    .catch((e: AxiosError) => {
      res.status(e.response?.status || 400)
      e.response && e.response.data.pipe(res)
    })
}

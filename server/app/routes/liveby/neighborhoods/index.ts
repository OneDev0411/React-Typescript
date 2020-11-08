import { Request, Response, NextFunction } from 'express'

import { request } from '../../../libs/request'

import {
  API_KEY,
  API_CLIENT_ID,
  REQUEST_TIMEOUT_MS,
  NEIGHBORHOODS_API_URL
} from '../constants'

export default async (req: Request, res: Response, next: NextFunction) => {
  request(req, res, {
    method: 'POST',
    responseType: 'stream',
    timeout: REQUEST_TIMEOUT_MS,
    url: NEIGHBORHOODS_API_URL,
    headers: {
      'X-API-CLIENTID': API_CLIENT_ID,
      'X-API-KEY': API_KEY
    },
    data: req.body
  }).then(response => {
    response.data.pipe(res)
  })
}

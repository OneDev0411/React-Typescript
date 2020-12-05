import { Request, Response, NextFunction } from 'express'
import axios, { AxiosError, AxiosResponse } from 'axios'

import {
  API_KEY,
  API_CLIENT_ID,
  REQUEST_TIMEOUT_MS,
  NEIGHBORHOOD_REPORT_API_URL
} from '../constants'

export default async (req: Request, res: Response, next: NextFunction) => {
  axios({
    method: 'POST',
    responseType: 'stream',
    timeout: REQUEST_TIMEOUT_MS,
    url: NEIGHBORHOOD_REPORT_API_URL,
    headers: {
      'content-type': 'application/json',
      'X-API-CLIENTID': API_CLIENT_ID,
      'X-API-KEY': API_KEY
    },
    data: req.body
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

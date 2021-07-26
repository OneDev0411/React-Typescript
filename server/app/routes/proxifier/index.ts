import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'

import { request } from '../../libs/request'
import { getParsedHeaders } from '../../utils/parse-headers'

export default async (req: Request, res: Response, next: NextFunction) => {
  request(req, {
    responseType: 'stream',
    method: <AxiosRequestConfig['method']>req.headers['x-method'],
    url: <string>req.headers['x-endpoint'],
    params: req.query,
    headers: getParsedHeaders(req),
    data: req.body
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

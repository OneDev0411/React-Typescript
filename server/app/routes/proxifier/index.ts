import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Request, Response, NextFunction } from 'express'

import { getParsedHeaders } from '../../utils/parse-headers'
import { request } from '../../libs/request'

export default async (req: Request, res: Response, next: NextFunction) => {
  request({
    method: <AxiosRequestConfig['method']>req.headers['x-method'],
    url: <string>req.headers['x-endpoint'],
    headers: getParsedHeaders(req),
    data: req.body
  }).then((response: AxiosResponse) => {
    res.status(response.status)
    response.data.pipe(res)
  })
}

import { AxiosError, AxiosResponse } from 'axios'
import { Request, Response, NextFunction } from 'express'

import { request } from '../../../libs/request'
import { getParsedHeaders } from '../../../utils/parse-headers'

export default async (req: Request, res: Response, next: NextFunction) => {
  request(req, {
    responseType: 'stream',
    url: `/brands/${req.params.brand}/deals.xlsx`,
    headers: getParsedHeaders(req)
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

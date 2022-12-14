import { AxiosResponse } from 'axios'
import { Request, Response, NextFunction } from 'express'

import { RequestError } from '../../../../types'
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
    .catch((e: RequestError) => {
      res.status(e.response?.status || 400)
      e.response?.data && e.response.data.pipe(res)
    })
}

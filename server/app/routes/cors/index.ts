import url from 'url'

import { Request, Response, NextFunction } from 'express'
import { AxiosError, AxiosResponse } from 'axios'

import { getParsedHeaders } from '../../utils/parse-headers'
import { request } from '../../libs/request'

export default async (req: Request, res: Response, next: NextFunction) => {
  const querystring = url.parse(req.url).query

  request({
    responseType: 'stream',
    headers: getParsedHeaders(req),
    url: querystring ? `${req.params.url}?${querystring}` : req.params.url
  })
    .then((response: AxiosResponse) => {
      response.data.pipe(res)
    })
    .catch((e: AxiosError) => {
      res.status(e.response?.status || 400)
      e.response && e.response.data.pipe(res)
    })
}

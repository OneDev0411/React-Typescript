import url from 'url'

import { Request, Response, NextFunction } from 'express'

import { request } from '../../libs/request'

export default async (req: Request, res: Response, next: NextFunction) => {
  const querystring = url.parse(req.url).query

  request(req, res, {
    responseType: 'stream',
    url: querystring ? `${req.params.url}?${querystring}` : req.params.url
  }).then(response => {
    response.data.pipe(res)
  })
}

import { Request, Response, NextFunction } from 'express'

import config from '../../../../../config/private'
import { request } from '../../../libs/request'

export default async (req: Request, res: Response, next: NextFunction) => {
  request(req, res, {
    method: 'post',
    responseType: 'stream',
    url: '/oauth2/token',
    data: {
      ...req.body,
      client_id: config.api.client_id,
      client_secret: config.api.client_secret
    }
  })
    .then(response => {
      response.data.pipe(res)
    })
    .catch(e => {
      next(e.response)
    })
}

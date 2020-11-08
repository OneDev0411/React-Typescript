import { Request, Response, NextFunction } from 'express'

import { request } from '../../../libs/request'

export default async (req: Request, res: Response, next: NextFunction) => {
  request(req, res, {
    responseType: 'stream',
    url: `/brands/${req.params.brand}/deals.xlsx`
  }).then(response => {
    response.data.pipe(res)
  })
}

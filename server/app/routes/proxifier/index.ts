import { AxiosRequestConfig } from 'axios'
import { Request, Response, NextFunction } from 'express'

import { request } from '../../libs/request'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    request(req, res, {
      method: <AxiosRequestConfig['method']>req.headers['x-method'],
      url: <string>req.headers['x-endpoint'],
      headers: req.headers,
      data: req.body
    })
      .then(response => {
        console.log(response)
        // response.data.pipe(res)
        res.json({})
      })
      .catch(e => next(e))
  } catch (e) {
    next(e)
  }
}

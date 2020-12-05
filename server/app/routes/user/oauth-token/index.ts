import { Response, NextFunction } from 'express'

import { AxiosError, AxiosResponse } from 'axios'

import config from '../../../../config'

import { getParsedHeaders } from '../../../utils/parse-headers'
import { request } from '../../../libs/request'

import type { RequestWithSession } from '../../../../types'

export default async (
  req: RequestWithSession,
  res: Response,
  next: NextFunction
) => {
  request({
    method: 'POST',
    url: '/oauth2/token',
    headers: getParsedHeaders(req),
    data: {
      ...req.body,
      client_id: config.client_id,
      client_secret: config.client_secret
    }
  })
    .then((response: AxiosResponse) => {
      req.session.user = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expire_date: new Date().getTime() + response.data.expires_in * 1000
      }

      res.send(response.data)
    })
    .catch((e: AxiosError) => {
      res.status(e.response?.status || 400)
      res.send(e.response?.data)
    })
}

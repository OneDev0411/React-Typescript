import { Request, Response, NextFunction } from 'express'

import { AxiosError, AxiosResponse } from 'axios'

import config from '../../../../../config/private'

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
      client_id: config.api.client_id,
      client_secret: config.api.client_secret
    }
  })
    .then((response: AxiosResponse) => {
      req.session.user = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expire_date: new Date().getTime() + response.data.expires_in * 1000
      }

      console.log(req.session.user)

      res.send(response.data)
    })
    .catch((e: AxiosError) => {
      res.status(e.response?.status || 400)
      res.send(e.response?.data)
    })
}

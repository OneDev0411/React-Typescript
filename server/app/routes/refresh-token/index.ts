import { Request, Response, NextFunction } from 'express'
import { AxiosResponse } from 'axios'

import config from '../../../../config/private'
import { request } from '../../libs/request'

import type { Session } from '../../../types'

export default async (
  req: Request & {
    session: Session
  },
  res: Response,
  next: NextFunction
) => {
  try {
    const response: AxiosResponse = await request({
      url: '/oauth2/token',
      headers: {
        'x-auth-mode': 'client_id'
      },
      data: {
        refresh_token: req.session.user.refresh_token,
        grant_type: 'refresh_token',
        client_id: config.api.client_id,
        client_secret: config.api.client_secret
      }
    })

    const { access_token, refresh_token, expires_in } = response.data

    req.session.user = {
      access_token,
      refresh_token,
      expire_date: Date.now() + expires_in * 1000
    }

    res.json({
      access_token,
      refresh_token
    })
  } catch (e) {
    res.status(e.response?.status || 400)
    res.send(e.response?.data)
  }
}

import { Request, Response, NextFunction } from 'express'

import { request } from '../../libs/request'

import config from '../../../../config/private'

import type { Session } from '../../../types'

export default async (
  req: Request & {
    session: Session
  },
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await request(req, res, {
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
    next(e)
  }
}

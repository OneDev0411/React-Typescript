import { Response } from 'express'

import { AxiosResponse } from 'axios'

import { getParsedHeaders } from '../../../utils/parse-headers'
import { request } from '../../../libs/request'

import type { RequestWithSession } from '../../../../types'

export default async (req: RequestWithSession, res: Response) => {
  if (!req.session?.user) {
    res.status(404)
    res.send('')

    return
  }

  try {
    const response: AxiosResponse = await request({
      method: 'get',
      url: '/users/self',
      params: {
        associations: ['user.docusign']
      },
      headers: getParsedHeaders(req)
    })

    res.set(response.headers)
    res.json({
      ...response.data,
      data: {
        ...response.data.data,
        access_token: req.session?.user?.access_token,
        refresh_token: req.session?.user?.refresh_token
      }
    })
  } catch (e) {
    res.status(e.response?.status || 400)
    e.response && e.response.data.pipe(res)
  }
}

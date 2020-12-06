import { AxiosError } from 'axios'
import { Request, Response } from 'express'

import { URL_PATTERN } from '../../../constants'

import { getParsedHeaders } from '../../../utils/parse-headers'
import { request } from '../../../libs/request'

export default async (req: Request, res: Response) => {
  await request(req, {
    url: `/envelopes/${req.params.id}/edit`,
    headers: getParsedHeaders(req),
    maxRedirects: 0
  })
    .then(() => {
      res.send('')
    })
    .catch((e: AxiosError) => {
      if (e.response?.status === 302) {
        const link = e.response.data
          .match(URL_PATTERN)
          .map((url: string) => url.trim())

        res.redirect(link)
      }

      if (e.response?.status === 400 || e.response?.status === 401) {
        res.send(
          'Access denied. This envelope was created by someone else. You cannot amend it'
        )
      }

      res.status(e.response?.status || 500)
    })
}

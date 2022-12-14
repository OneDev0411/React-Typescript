import { AxiosError } from 'axios'
import { Request, Response } from 'express'

import { request } from '../../../libs/request'
import { getErrorRedirectUrl } from '../../../utils/get-error-redirect-url'
import { getParsedHeaders } from '../../../utils/parse-headers'

export default async (req: Request, res: Response) => {
  await request(req, {
    url: `/envelopes/${req.params.id}/edit`,
    headers: getParsedHeaders(req),
    maxRedirects: 0
  })
    .then(() => {
      res.send('')
    })
    .catch((e: AxiosError<string>) => {
      const errorRedirectUrl = getErrorRedirectUrl(e)

      if (errorRedirectUrl) {
        res.redirect(errorRedirectUrl)

        return
      }

      if (e.response?.status === 400 || e.response?.status === 401) {
        res.send(
          // eslint-disable-next-line max-len
          'Access denied. This envelope was created by someone else. You cannot amend it'
        )
      }

      res.status(e.response?.status || 500)
    })
}

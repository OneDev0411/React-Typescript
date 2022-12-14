import { AxiosError } from 'axios'
import { Request, Response } from 'express'

import { request } from '../../../libs/request'
import { getErrorRedirectUrl } from '../../../utils/get-error-redirect-url'
import { getParsedHeaders } from '../../../utils/parse-headers'

export default async (req: Request, res: Response) => {
  request(req, {
    url: '/users/self/docusign/auth',
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

      res.status(e.response?.status || 500)
    })
}

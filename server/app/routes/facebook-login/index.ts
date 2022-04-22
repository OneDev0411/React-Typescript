import { AxiosError } from 'axios'
import { Request, Response } from 'express'

import { URL_PATTERN } from '../../constants'
import { request } from '../../libs/request'
import { getParsedHeaders } from '../../utils/parse-headers'

// TODO: Merge this with docusign-login if possible
export default async (req: Request, res: Response) => {
  request(req, {
    url: `/brands/${req.query.brand_id}/users/self/facebook/auth`,
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
      } else {
        res.redirect(
          `/api/facebook/auth-result?error=Unknown&message=${e.response?.data?.message}`
        )
      }

      res.status(e.response?.status || 500)
    })
}

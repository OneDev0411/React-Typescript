import { AxiosError } from 'axios'
import { Request, Response } from 'express'

import { getParsedHeaders } from '../../../utils/parse-headers'
import { request } from '../../../libs/request'

const urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi

export default async (req: Request, res: Response) => {
  request({
    url: '/users/self/docusign/auth',
    headers: getParsedHeaders(req),
    maxRedirects: 0
  })
    .then(() => {
      res.send('')
    })
    .catch((e: AxiosError) => {
      if (e.response?.status === 302) {
        const link = e.response.data
          .match(urlPattern)
          .map((url: string) => url.trim())

        res.redirect(link)
      }

      res.status(e.response?.status || 500)
    })
}

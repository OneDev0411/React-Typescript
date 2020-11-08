import { AxiosError } from 'axios'
import { Request, Response } from 'express'

import { request } from '../../../libs/request'

const urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi

export default async (req: Request, res: Response) => {
  await request(req, res, {
    url: `/envelopes/${req.params.id}/edit`
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

      if (e.response?.status === 400 || e.response?.status === 401) {
        res.send(
          'Access denied. This envelope was created by someone else. You cannot amend it'
        )
      }

      res.status(e.response?.status || 500)
    })
}

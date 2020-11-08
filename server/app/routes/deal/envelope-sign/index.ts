import { AxiosError } from 'axios'
import { Request, Response } from 'express'

import { request } from '../../../libs/request'

const urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi

export default async (req: Request, res: Response) => {
  request(req, res, {
    url: `/envelopes/${req.params.id}/sign/${req.params.recipient}`,
    maxRedirects: 0
  })
    .then(() => {
      res.send('')
    })
    .catch((e: AxiosError) => {
      if (e.response?.status === 302) {
        res.redirect(
          e.response.data.match(urlPattern).map((url: string) => url.trim())
        )
      }

      res.status(e.response?.status || 500)
    })
}

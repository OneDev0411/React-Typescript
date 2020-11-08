import { AxiosError } from 'axios'
import { Request, Response } from 'express'

import { getParsedHeaders } from '../../../utils/parse-headers'
import { request } from '../../../libs/request'

const urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi

export default async (req: Request, res: Response) => {
  request({
    url: `/envelopes/${req.params.id}/sign/${req.params.recipient}`,
    headers: getParsedHeaders(req),
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

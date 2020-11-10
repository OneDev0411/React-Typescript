import { AxiosError, AxiosResponse } from 'axios'
import { Request, Response, NextFunction } from 'express'
import fecha from 'fecha'

import { getParsedHeaders } from '../../../utils/parse-headers'
import { request } from '../../../libs/request'

export default async (req: Request, res: Response, next: NextFunction) => {
  const data = JSON.parse(decodeURIComponent(req.params.data))

  const fileName = `Rechat ${data.title} ${fecha.format(
    new Date(),
    'MM-DD-YY'
  )}`

  res.setHeader('Content-Disposition', `attachment; filename=${fileName}.csv`)

  request({
    responseType: 'stream',
    url: `/brands/${req.params.brand}/deals.xlsx`,
    method: 'POST',
    headers: {
      ...getParsedHeaders(req),
      'X-RECHAT-BRAND': data.brand
    },
    data: { filter: data.filter, project: data.project }
  })
    .then((response: AxiosResponse) => {
      res.set(response.headers)
      response.data.pipe(res)
    })
    .catch((e: AxiosError) => {
      res.status(e.response?.status || 400)
      e.response && e.response.data.pipe(res)
    })
}

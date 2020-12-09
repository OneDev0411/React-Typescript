import { AxiosError, AxiosResponse } from 'axios'
import { Request, Response, NextFunction } from 'express'
import fecha from 'fecha'

import { getParsedHeaders } from '../../../utils/parse-headers'
import { request } from '../../../libs/request'

export default async (req: Request, res: Response, next: NextFunction) => {
  const data = JSON.parse(
    Buffer.from(req.params.data, 'base64').toString('binary')
  )

  const fileName = `Rechat ${data.title} ${fecha.format(
    new Date(),
    'MM-DD-YY'
  )}`

  request(req, {
    responseType: 'stream',
    url: `/analytics/deals/facts?order=${data.order}&format=csv`,
    method: 'POST',
    headers: {
      ...getParsedHeaders(req),
      'x-rechat-brand': data.brand
    },
    data: { filter: data.filter, project: data.project }
  })
    .then((response: AxiosResponse) => {
      res.set({
        ...response.headers,
        'Content-Disposition': `attachment; filename=${fileName}.csv`
      })

      response.data.pipe(res)
    })
    .catch((e: AxiosError) => {
      res.status(e.response?.status || 400)
      e.response && e.response.data.pipe(res)
    })
}

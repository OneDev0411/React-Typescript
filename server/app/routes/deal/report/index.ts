import { Request, Response, NextFunction } from 'express'
import fecha from 'fecha'

import { request } from '../../../libs/request'

export default async (req: Request, res: Response, next: NextFunction) => {
  const data = JSON.parse(decodeURIComponent(req.params.data))

  const fileName = `Rechat ${data.title} ${fecha.format(
    new Date(),
    'MM-DD-YY'
  )}`

  res.setHeader('Content-Disposition', `attachment; filename=${fileName}.csv`)

  request(req, res, {
    responseType: 'stream',
    url: `/brands/${req.params.brand}/deals.xlsx`,
    method: 'POST',
    headers: {
      'X-RECHAT-BRAND': data.brand
    },
    data: { filter: data.filter, project: data.project }
  }).then(response => {
    response.data.pipe(res)
  })
}

import { Request, Response } from 'express'

import config from '../../../../config/public'
import { request } from '../../libs/request'

export default async (req: Request, res: Response) => {
  const { form, pdfUrl } = req.body

  let totalSize = 0

  try {
    const response = await request(req, res, {
      method: 'HEAD',
      url: pdfUrl || `${config.forms.url}/${form}.pdf`
    })

    totalSize = ~~response.headers['content-length']
  } catch (e) {
  } finally {
    res.json({
      total: totalSize
    })
  }
}

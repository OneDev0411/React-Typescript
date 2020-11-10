import { Request, Response } from 'express'

import config from '../../../config'
import { request } from '../../libs/request'

export default async (req: Request, res: Response) => {
  const { form, pdfUrl } = req.body

  let totalSize = 0

  try {
    const response = await request({
      method: 'HEAD',
      url: pdfUrl || `${config.forms_url}/${form}.pdf`
    })

    totalSize = ~~response.headers['content-length']
  } catch (e) {
    /* nothing */
  } finally {
    res.json({
      total: totalSize
    })
  }
}

import { AxiosResponse } from 'axios'
import { Request, Response } from 'express'

import config from '../../../config'
import { request } from '../../libs/request'

export default async (req: Request, res: Response) => {
  const { form, pdfUrl } = req.body

  request(req, {
    method: 'HEAD',
    url: pdfUrl || `${config.forms_url}/${form}.pdf`
  })
    .then((response: AxiosResponse) => {
      res.status(200).json({
        total: Number(response.headers['content-length'])
      })
    })
    .catch(e => {
      res.status(200).json({
        total: 0
      })
    })
}

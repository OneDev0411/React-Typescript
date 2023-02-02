import axios from 'axios'
import { Request, Response } from 'express'
import qs from 'qs'

const BASE_URL = 'https://api2.branch.io'

export default async (req: Request, res: Response) => {
  console.log(req.body)

  try {
    const response = await axios({
      method: req.method,
      baseURL: BASE_URL,
      url: '/v1/open',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(req.body)
    })

    res.send(response.data)
  } catch (e) {
    res.status(e.response?.status || 400)
    res.send('Error')
  }
}

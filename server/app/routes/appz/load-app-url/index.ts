import axios from 'axios'
import { Request, Response } from 'express'

const BASE_URL = 'https://gist.githubusercontent.com'

export default async (req: Request, res: Response) => {
  const url = req.query.url

  try {
    const response = await axios.get(`${BASE_URL}/${url}`)

    res.set('Content-Type', 'application/javascript')
    res.send(response.data)
  } catch (e) {
    res.status(e.response?.status || 400)
    res.send('Error')
  }
}

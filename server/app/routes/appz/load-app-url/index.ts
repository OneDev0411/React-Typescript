import axios from 'axios'
import { Request, Response } from 'express'

export default async (req: Request, res: Response) => {
  const url = req.query.url as string

  try {
    const response = await axios.get(url)

    res.set('Content-Type', 'application/javascript')
    res.send(response.data)
  } catch (e) {
    res.status(e.response?.status || 400)
    res.send('Error')
  }
}

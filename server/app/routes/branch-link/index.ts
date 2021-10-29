import axios from 'axios'
import { Request, Response } from 'express'

const BASE_URL = 'https://api2.branch.io'

export default async (req: Request, res: Response) => {
  const method = req.params[0]

  try {
    const response = await axios.post(`${BASE_URL}/${method}`, req.body)

    res.send(response.data)
  } catch (e) {
    res.status(e.response?.status || 400)
    res.send('Error')
  }
}

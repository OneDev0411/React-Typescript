import { Request, Response } from 'express'

export default (req: Request, res: Response) => {
  res.send('Rechat is up and running')
}

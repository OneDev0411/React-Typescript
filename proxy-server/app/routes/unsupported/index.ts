import fs from 'fs'
import path from 'path'

import { Request, Response } from 'express'

const template = fs.readFileSync(
  path.resolve(__dirname, './template.html'),
  'utf8'
)

export default (req: Request, res: Response) => {
  res.send(template)
}

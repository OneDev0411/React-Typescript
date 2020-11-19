import fs from 'fs'
import path from 'path'

import { Request, Response } from 'express'

const template = fs.readFileSync(
  path.resolve(__dirname, './template.html'),
  'utf8'
)

export default async (req: Request, res: Response) => {
  res.set('content-type', 'text/html; charset=utf-8')
  res.send(template)
}

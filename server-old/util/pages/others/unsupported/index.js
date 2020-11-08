import fs from 'fs'
import path from 'path'

import Koa from 'koa'

const app = new Koa()
const router = require('koa-router')()
const template = fs.readFileSync(
  path.resolve(__dirname, './template.html'),
  'utf8'
)

router.get('/unsupported', async ctx => {
  ctx.set('content-type', 'text/html; charset=utf-8')
  ctx.body = template
})

module.exports = app.use(router.routes())

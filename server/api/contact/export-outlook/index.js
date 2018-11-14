import Koa from 'koa'

const PassThrough = require('stream').PassThrough

const router = require('koa-router')()

const app = new Koa()

router.get('/contacts/export/outlook/:brand', async ctx => {
  try {
    const { user } = ctx.session
    const { 'ids[]': ids, 'filters[]': filters, 'users[]': users } = ctx.query
    const { brand } = ctx.params
    let data = {}
    let usersString

    if (ids) {
      if (typeof ids === 'string') {
        data = {
          ids: [ids]
        }
      } else if (Array.isArray(ids)) {
        data = { ids }
      }
    } else if (filters) {
      if (typeof filters === 'string') {
        data = { filters: [JSON.parse(decodeURIComponent(filters))] }
      } else if (Array.isArray(filters)) {
        data = {
          filters: filters.map(filter => JSON.parse(decodeURIComponent(filter)))
        }
      }
    }

    if (typeof users === 'string') {
      usersString = users
    } else if (Array.isArray(users)) {
      usersString = users.join('&users[]=')
    }

    if (!user) {
      ctx.status = 401
      ctx.body = 'Unauthorized'

      return
    }

    ctx.body = ctx
      .fetch(`/contacts/outlook.csv?users[]=${usersString}`, 'POST')
      .set('Authorization', `Bearer ${user.access_token}`)
      .set({ 'X-RECHAT-BRAND': brand })
      .send(data)
      .on('response', res => {
        ctx.set('Content-Disposition', res.headers['content-disposition'])
      })
      .pipe(PassThrough())
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())

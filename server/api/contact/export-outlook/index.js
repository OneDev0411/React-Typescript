import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

const router = require('koa-router')()

const app = new Koa()

function handleIds(ids) {
  if (typeof ids === 'string') {
    return {
      ids: [ids]
    }
  }

  if (Array.isArray(ids)) {
    return {
      ids
    }
  }

  return {}
}

function handleFilters(filters) {
  if (typeof filters === 'string') {
    return {
      filter: [JSON.parse(decodeURIComponent(filters))]
    }
  }

  if (Array.isArray(filters)) {
    return {
      filter: filters.map(filter => JSON.parse(decodeURIComponent(filter)))
    }
  }

  return {}
}

router.post('/contacts/export/outlook/:brand', bodyParser(), async ctx => {
  try {
    const { user } = ctx.session

    if (!user) {
      ctx.status = 401
      ctx.body = 'Unauthorized'

      return
    }

    const { ids, filters, users, type } = ctx.request.body

    const { brand } = ctx.params
    let data = {}
    let usersString = ''

    if (ids) {
      data = handleIds(ids)
    } else if (filters) {
      data = handleFilters(filters)
    }

    if (typeof users === 'string') {
      usersString = `&users[]=${users}`
    } else if (Array.isArray(users) && users.length > 0) {
      usersString = `&users[]=${users.join('&users[]=')}`
    }

    let url

    if (type === 'same') {
      url = '/analytics/contact_joint_export/facts?format=csv'
    } else if (type === 'separate') {
      url = '/analytics/contact_export/facts?format=csv'
    }

    const response = await ctx
      .fetch(`${url}${usersString}`, 'POST')
      .set('Authorization', `Bearer ${user.access_token}`)
      .set({ 'X-RECHAT-BRAND': brand })
      .send(data)

    ctx.set(
      'x-rechat-filename',
      response.headers['content-disposition']
        .split('"')
        .join('')
        .split('filename=')
        .pop()
    )
    ctx.body = response.text
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())

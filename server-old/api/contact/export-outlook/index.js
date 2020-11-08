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

function handleFilters(
  filters,
  flows,
  crmTasks,
  excludes = [],
  searchText = ''
) {
  const resultFilters = {}

  if (Array.isArray(filters) && filters.length > 0) {
    resultFilters.filter = filters
  }

  if (Array.isArray(excludes) && excludes.length > 0) {
    resultFilters.excludes = excludes
  }

  if (Array.isArray(crmTasks) && crmTasks.length > 0) {
    resultFilters.crm_tasks = crmTasks
  }

  if (Array.isArray(flows) && flows.length > 0) {
    resultFilters.flows = flows
  }

  if (searchText.length > 0) {
    resultFilters.query = searchText
  }

  return resultFilters
}

router.post('/contacts/export/outlook/:brand', bodyParser(), async ctx => {
  try {
    const { user } = ctx.session

    if (!user) {
      ctx.status = 401
      ctx.body = 'Unauthorized'

      return
    }

    const {
      ids,
      filters,
      flows,
      crm_tasks,
      excludes,
      users,
      type,
      searchText,
      filter_type = 'and'
    } = ctx.request.body

    const { brand } = ctx.params
    let data = {}
    let usersString = ''

    if (ids) {
      data = handleIds(ids)
    } else {
      data = handleFilters(filters, flows, crm_tasks, excludes, searchText)
    }

    if (typeof users === 'string') {
      usersString = `&users[]=${users}`
    } else if (Array.isArray(users) && users.length > 0) {
      usersString = `&users[]=${users.join('&users[]=')}`
    }

    const url = `/analytics/${type}/facts?filter_type=${filter_type}&format=csv`

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

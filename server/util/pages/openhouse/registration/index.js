import Koa from 'koa'

const router = require('koa-router')()
const app = new Koa()

router.get('/openhouse/:id/:brand/register', async ctx => {
  const { user } = ctx.session

  if (!user) {
    ctx.status = 401
    ctx.body = 'Unauthorized Access Error'

    return false
  }

  let openHouse

  try {
    const response = await ctx
      .fetch(`/crm/tasks/${ctx.params.id}`, 'GET')
      .set('Authorization', `Bearer ${user.access_token}`)
      .set('X-RECHAT-BRAND', ctx.params.brand)

    openHouse = response.body.data
  } catch (e) {
    console.log(e)

    ctx.body = e.response.body.message
    ctx.status = e.response.statusCode

    return false
  }

  // get template
  const { template } = openHouse.metadata

  ctx.body = template
})

module.exports = app.use(router.routes())

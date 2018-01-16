import Koa from 'koa'
import agent from 'superagent'

const router = require('koa-router')()
const app = new Koa()


router.get('/deals/excel', async (ctx, next) => {
  try {
    const { user } = ctx.session

    if (!user) {
      ctx.status = 404

      return false
    }

    let url = `/brands/${user.brand}/deals.xls`


    ctx.set('Content-Disposition', 'attachment')
    ctx.attachment('deals.xls')

    const response
      // = agent.get(url)
      //   .set('Authorization', `Bearer ${ctx.session.user.access_token}`)
    = await ctx.fetch(url)
      .set('Authorization', `Bearer ${ctx.session.user.access_token}`)

    console.log('response: ', response)
    ctx.body = response
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())

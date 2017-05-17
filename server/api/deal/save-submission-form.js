import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/deals/submission/form', bodyParser(), async (ctx, next) => {

  const { state, values, form, deal, type, submission } = ctx.request.body

  // setup endpoint according to update or create
  let endpoint = ''

  // define request method
  const method = (type === 'update') ? 'PUT' : 'POST'

  // initialize data to send
  const data = { state, values }

  if (type === 'create') {
    data.form = form
    endpoint = `/deals/${deal}/submissions`
  } else {
    endpoint = `/forms/submissions/${submission}`
  }

  try {
    const response = await ctx
      .fetch(endpoint, method)
      .send(data)

    ctx.body = response.body
  }
  catch(e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())

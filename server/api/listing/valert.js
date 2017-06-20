import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/listings/valerts', async (ctx, next) => {

  const req = ctx.request
  const  { options } = ctx.request.body

  // base endpoint
  let endpoint = '/valerts'

  // From map widget
  if (req.body.office && !options.list_offices.length) {
    endpoint += '?associations=compact_listing.proposed_agent&order_by=office,status&office=' + req.body.office
  }

  // From listing widget
  if (options.list_offices && options.list_offices.length) {
    endpoint += '?associations=compact_listing.proposed_agent'

    if (options.listing_statuses[0] === 'Sold') {
      endpoint += '&order_by=price'
    }
  }

  const headers = {}

  if (req.body.options.brand) {
    headers['x-rechat-brand'] = req.body.options.brand
  }

  // Offset
  if (req.body.offset) {
    endpoint = endpoint + '&limit=500&offset=' + req.body.offset
  }

  try {
    const response = await ctx.fetch(endpoint, 'POST').set(headers).send(options)
    ctx.body = response.body
  }
  catch(e) {}
})

app.use(bodyParser())
module.exports = app.use(router.routes())

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/listings/valerts', async (ctx, next) => {

  const  { options } = ctx.request.body

  // base endpoint
  let endpoint = '/valerts'

  // From map widget
  if (req.body.office && !options.list_offices) {
    endpoint = endpoint + '?associations=compact_listing.list_agent,compact_listing.list_office,compact_listing.selling_office,compact_listing.selling_agent&order_by=office,status&office=' + req.body.office
  }

  // From listing widget
  if (options.list_offices && options.list_offices.length) {
    endpoint = endpoint + '?associations=compact_listing.list_agent'

    if (options.listing_statuses[0] === 'Sold') {
      endpoint = endpoint + '&order_by=price'
    }
  }

  // Offset
  if (req.body.offset) {
    endpoint = endpoint + '&limit=75&offset=' + req.body.offset
  }

  try {
    const response = await ctx.fetch(endpoint, 'POST')
    ctx.body = response.body
  }
  catch(e) {}
})

app.use(bodyParser())
module.exports = app.use(router.routes())

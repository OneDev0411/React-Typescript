import Koa from 'koa'
const router = require('koa-router')()
const PassThrough = require('stream').PassThrough
const app = new Koa()

router.get('/deals/envelope/preview', async (ctx, next) => {

  const envelope_id = ctx.request.query.id
  const envelope_index = ~~ctx.request.query.index + 1 // Documents should start from 1 not 0.
  const filename = envelope_id + '_' + envelope_index + '.pdf'
  const endpoint = `/envelopes/${envelope_id}/${envelope_index}.pdf`

  try {
    const response = await ctx.stream(endpoint)

    ctx.set('Content-disposition', 'inline; filename="' + filename + '"')
    ctx.set('Content-type', 'application/pdf')
    ctx.body = response.pipe(PassThrough())
  }
  catch(e) {}
})

module.exports = app.use(router.routes())

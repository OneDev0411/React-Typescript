import WebpackDevMiddleware from 'webpack-dev-middleware'
import c2k from '../c2k'

export default function(compiler, publicPath) {
  const middleware = WebpackDevMiddleware(compiler, {
    publicPath,
    hot: true,
    quiet: false,
    inline: true,
    noInfo: false,
    lazy: false,
    stats: false
  })

  return async function dev(ctx, next) {
    const hasNext = await c2k(middleware, ctx.req, {
      end: content => (ctx.body = content),
      setHeader() {
        ctx.set(...arguments)
      }
    })

    if (hasNext) {
      await next()
    }
  }
}

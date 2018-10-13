import WebpackHotMiddleware from 'webpack-hot-middleware'
import c2k from '../c2k'

export default function(compiler) {
  const middleware = WebpackHotMiddleware(compiler)

  return async function hmr(ctx, next) {
    const hasNext = await c2k(middleware, ctx.req, ctx.res)

    if (hasNext) {
      await next()
    }
  }
}

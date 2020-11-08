export const logger = async (ctx, next) => {
  if (process.env.NODE_ENV === 'development') {
    ctx.log = () => {}

    return next()
  }

  const id = ctx.headers['x-request-id'] || Math.random()

  const log = (...params) => {
    console.log.apply(console, [id, ...params])
  }

  ctx.log = log

  await next()
}

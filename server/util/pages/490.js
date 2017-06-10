const refresh = async ctx => {
  const response = await ctx.fetch('/oauth2/token', 'POST')
    .send({
      client_id: ctx.config.api.client_id,
      client_secret: ctx.config.api.client_secret,
      refresh_token: ctx.session.user.refresh_token,
      grant_type: 'refresh_token'
    })

  ctx.session.user.access_token = response.body.access_token
  ctx.session.user.refresh_token = response.body.refresh_token
}

const handler = async (ctx, next) => {
  if (!ctx.session || !ctx.session.user)
    return await next()

  const access_token = ctx.session.user.access_token

  let response

  try {
    response = await ctx.fetch('/admin/ping')
      .set('Authorization', `Bearer ${access_token}`)
  } catch (e) {
    if (e.status !== 490)
      return await next()

    await refresh(ctx)
  }

  return await next()
}

export default handler
export default function(ctx, data) {
  const userSession = ctx.session.user

  if (userSession && data.updated_at > userSession.updated_at) {
    const { access_token } = userSession

    ctx.session.user = {
      ...data,
      ...{access_token}
    }
  }
}

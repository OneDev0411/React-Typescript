const updateSession = (ctx, user) => {
  const { access_token, refresh_token, data } = user

  if (access_token) {
    ctx.session.user = {
      ...data,
      access_token,
      refresh_token
    }

    return
  }

  const currentUser = ctx.session.user

  if (currentUser && data.updated_at > currentUser.updated_at) {
    const { access_token, refresh_token } = currentUser

    ctx.session.user = {
      ...data,
      access_token,
      refresh_token
    }
  }
}

export default updateSession

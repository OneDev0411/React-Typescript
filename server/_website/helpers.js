export function isEmpty(fields) {
  return fields.some(item => !!item === false)
}

export function template_path(name) {
  const isDev = process.env.NODE_ENV === 'development'

  return isDev ? `_website/${name}` : `../app/templates/_website/${name}`
}

export function isLoggedIn(ctx) {
  return !!(ctx.session && ctx.session.user && ctx.session.user.access_token)
}

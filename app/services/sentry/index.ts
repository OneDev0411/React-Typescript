export function setupSentry(user: IUser, brand: IBrand) {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  if (!window.Sentry) {
    return
  }

  window.Sentry.onLoad(() => {
    window.Sentry.init({
      environment: process.env.SENTRY_ENVIRONMENT,
      release: process.env.SOURCE_VERSION,
      beforeSend: (event, hint) => {
        console.log('[ Sentry ] ', hint.originalException)

        return event
      }
    })

    window.Sentry.configureScope(scope => {
      scope.setUser({
        id: user.id,
        email: user.email,
        name: user.display_name,
        brand: brand && {
          id: brand.id,
          name: brand.name
        }
      })
    })
  })
}

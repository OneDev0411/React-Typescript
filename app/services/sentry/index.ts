import * as Sentry from '@sentry/browser'

export function setupSentry(user: IUser, brand: IBrand) {
  Sentry.configureScope(scope => {
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
}

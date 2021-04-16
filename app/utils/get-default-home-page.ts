import { IUserState } from 'reducers/user'

export function getUserDefaultHomepage(user?: IUserState): string {
  const dashboardBaseUrl = '/dashboard'

  if (!user) {
    return `${dashboardBaseUrl}/mls`
  }

  return `${dashboardBaseUrl}/overview`
}

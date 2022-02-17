import { hasUserAccessToCrm, hasUserAccessToDeals } from './acl'

export function getUserDefaultHomepage(team?: Nullable<IUserTeam>): string {
  const dashboardBaseUrl = '/dashboard'

  if (!team) {
    return `${dashboardBaseUrl}/mls`
  }

  if (hasUserAccessToCrm(team) || hasUserAccessToDeals(team)) {
    return `${dashboardBaseUrl}/overview`
  }

  return `${dashboardBaseUrl}/mls`
}

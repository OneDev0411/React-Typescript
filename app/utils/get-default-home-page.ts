import { IUserState } from 'reducers/user'
import { hasUserAccess } from './user-teams'

export function getUserDefaultHomepage(user?: IUserState): string {
  const dashboardBaseUrl = '/dashboard'
  if (!user) {
    return `${dashboardBaseUrl}/mls`
  }
  
  if (hasUserAccess(user, 'CRM') || hasUserAccess(user, 'Deals')) {
    return `${dashboardBaseUrl}/overview`
  }
  
  return `${dashboardBaseUrl}/mls`

}

import { hasUserAccess } from './user-teams'

export function getUserDefaultHomepage(user?: IUser): string {
  const dashboardBaseUrl = '/dashboard/'
  let defaultHomepage = `${dashboardBaseUrl}mls`

  if (!user) {
    return defaultHomepage
  }

  if (hasUserAccess(user, 'Marketing')) {
    return `${dashboardBaseUrl}marketing`
  }

  if (hasUserAccess(user, 'CRM')) {
    return `${dashboardBaseUrl}contacts`
  }

  if (
    hasUserAccess(user, 'Deals') ||
    hasUserAccess(user, 'BackOffice')
  ) {
    return `${dashboardBaseUrl}deals`
  }

  return defaultHomepage
}

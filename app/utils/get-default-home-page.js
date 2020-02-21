import { hasUserAccess } from './user-teams'

export default function getUserDefaultHomepage(user) {
  let defaultHomepage = '/dashboard/mls'

  if (!user) {
    return defaultHomepage
  }

  if (hasUserAccess(user, 'Marketing')) {
    return '/dashboard/marketing'
  }

  if (hasUserAccess(user, 'CRM')) {
    return '/dashboard/contacts'
  }

  if (
    hasUserAccess(user, 'Deals') ||
    hasUserAccess(user, 'BackOffice')
  ) {
    return '/dashboard/deals'
  }

  return defaultHomepage
}

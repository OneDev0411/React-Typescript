import { hasUserAccess } from './user-teams'

export default function getUserDefaultHomepage(user) {
  let defaultHomepage = '/dashboard/mls'

  if (!user) {
    return defaultHomepage
  }

  if (hasUserAccess(user, 'CRM')) {
    defaultHomepage = '/dashboard/contacts'
  }

  if (
    hasDealshasUserAccess(user, 'Deals') ||
    hasUserAccess(user, 'BackOffice')
  ) {
    defaultHomepage = '/dashboard/deals'
  }

  return defaultHomepage
}

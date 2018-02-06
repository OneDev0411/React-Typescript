import { hasUserAccess } from './user-teams'

let defaultHomepage = '/dashboard/mls'

export default function getHomepage(user) {
  if (!user) {
    return defaultHomepage
  }

  const hasDealsPermission = hasUserAccess(user, 'Deals')
  const hasBackOfficePermission = hasUserAccess(user, 'BackOffice')

  if (hasDealsPermission || hasBackOfficePermission) {
    defaultHomepage = '/dashboard/deals'
  }

  return defaultHomepage
}

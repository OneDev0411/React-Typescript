import { hasUserAccess } from './user-teams'

export default function getUserDefaultHomepage(user) {
  let defaultHomepage = '/dashboard/mls'

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

import { hasUserAccess, getActiveTeamACL } from './user-teams'

let defaultHomepage = '/dashboard/mls'

export default function getHomepage(user) {
  if (!user) {
    return defaultHomepage
  }

  const acl = getActiveTeamACL(user)
  const hasDealsPermission = acl.includes('Deals')
  const hasBackOfficePermission = acl.includes('BackOffice')

  if (hasDealsPermission || hasBackOfficePermission) {
    defaultHomepage = '/dashboard/deals'
  }

  return defaultHomepage
}

import { hasUserAccess, getUserRoles } from './user-acl'

let defaultHomepage = '/dashboard/mls'

export default function getHomepage(user) {
  if (!user) {
    return defaultHomepage
  }

  const roles = getUserRoles(user)
  const hasDealsPermission = roles.includes('Deals')
  const hasBackOfficePermission = roles.includes('BackOffice')

  if (hasDealsPermission || hasBackOfficePermission) {
    defaultHomepage = '/dashboard/deals'
  }

  return defaultHomepage
}
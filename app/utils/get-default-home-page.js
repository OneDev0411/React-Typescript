import { hasUserAccess, getActiveBrand } from './user-brands'

let defaultHomepage = '/dashboard/mls'

export default function getHomepage(user) {
  if (!user) {
    return defaultHomepage
  }

  const roles = getActiveBrand(user)
  const hasDealsPermission = roles.includes('Deals')
  const hasBackOfficePermission = roles.includes('BackOffice')

  if (hasDealsPermission || hasBackOfficePermission) {
    defaultHomepage = '/dashboard/deals'
  }

  return defaultHomepage
}

import {
  hasUserAccessToCrm,
  hasUserAccessToDeals,
  hasUserAccessToShowings,
  isBackOffice
} from '@app/utils/acl'

export type AccessListType = {
  hasBackOfficeAccess: boolean
  hasCrmAccess: boolean
  hasDealsAccess: boolean
  hasShowingsAccess: boolean
}

/**
 * Returns the list of access our base dashboaed component need
 * @param activeTeam The active team
 * @returns The list of access
 */

export function getDashboardAccessList(
  activeTeam: Nullable<IUserTeam>
): AccessListType {
  const hasBackOfficeAccess = isBackOffice(activeTeam)
  const hasCrmAccess = hasUserAccessToCrm(activeTeam)
  const hasDealsAccess = hasUserAccessToDeals(activeTeam) || hasBackOfficeAccess
  const hasShowingsAccess = hasUserAccessToShowings(activeTeam)

  return {
    hasCrmAccess,
    hasDealsAccess,
    hasShowingsAccess,
    hasBackOfficeAccess
  }
}

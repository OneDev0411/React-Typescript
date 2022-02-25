import { ACL } from '../constants/acl'

/**
 * Return the given team's acl
 * @param team The team
 * @returns list of acl
 */

export function getTeamACL(team: Nullable<IUserTeam>): string[] {
  return team?.acl ?? []
}

/**
 * Indicate that user has access to the given permission or not
 * @param team The active team
 * @param access The permission should be check
 * @returns true or false
 */
export function hasUserAccess(
  team: Nullable<IUserTeam>,
  access: IPermission
): boolean {
  if (!team) {
    return false
  }

  return getTeamACL(team).includes(access)
}

/**
 * Indicate that user has access to the deal or not
 * @param team The active team
 * @returns true or false
 */
export function hasUserAccessToDeals(team: Nullable<IUserTeam>): boolean {
  return hasUserAccess(team, ACL.DEALS) || isBackOffice(team)
}

/**
 * Indicate that user has access to the CRM or not
 * @param team The active team
 * @returns true or false
 */
export function hasUserAccessToCrm(team: Nullable<IUserTeam>): boolean {
  return hasUserAccess(team, ACL.CRM)
}

/**
 * Indicate that user has access to the MC or not
 * @param team The active team
 * @returns true or false
 */
export function hasUserAccessToMarketingCenter(
  team: Nullable<IUserTeam>
): boolean {
  return hasUserAccess(team, ACL.MARKETING)
}

/**
 * Indicate that user has access to the agent network or not
 * @param team The active team
 * @returns true or false
 */
export function hasUserAccessToAgentNetwork(
  team: Nullable<IUserTeam>
): boolean {
  return hasUserAccess(team, ACL.AGENT_NETWORK)
}

/**
 * Indicate that user has access to the website or not
 * @param team The active team
 * @returns true or false
 */
export function hasUserAccessToWebsites(team: Nullable<IUserTeam>): boolean {
  return hasUserAccess(team, ACL.WEBSITES)
}

/**
 * Indicate that user has access to the showing or not
 * @param team The active team
 * @returns true or false
 */
export function hasUserAccessToShowings(team: Nullable<IUserTeam>): boolean {
  return hasUserAccess(team, ACL.SHOWINGS)
}

/**
 * Indicate that user is a backoffice or not
 * @param team The active team
 * @returns true or false
 */
export function isBackOffice(team: Nullable<IUserTeam>): boolean {
  return hasUserAccess(team, ACL.BACK_OFFICE)
}

/**
 * Indicate that user is an admin or not
 * @param team The active team
 * @returns true or false
 */
export function isAdmin(team: Nullable<IUserTeam>): boolean {
  return hasUserAccess(team, ACL.ADMIN)
}

/**
 * Indicate that user has access to the brand setting or not
 * @param team The active team
 * @returns true or false
 */
export function hasUserAccessToBrandSettings(
  team: Nullable<IUserTeam>
): boolean {
  const brand = team?.brand

  // Only brokerages should have brand settings
  if (!brand || brand.brand_type !== 'Brokerage') {
    return false
  }

  // User should be an admin and should have access to MC
  return isAdmin(team) && hasUserAccessToMarketingCenter(team)
}

/**
 * Indicate that user is able to upload assets for a brand
 * @param team The active team
 * @returns true or false
 */
export function hasUserAccessToUploadBrandAssets(
  team: Nullable<IUserTeam>
): boolean {
  // User should be an admin and should have access to MC
  return isAdmin(team) && hasUserAccessToMarketingCenter(team)
}

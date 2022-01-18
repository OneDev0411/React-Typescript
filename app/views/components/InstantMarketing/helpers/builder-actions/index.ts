/**
 * It should return true if builder needs to have the "Create super campaign" button
 */
export function hasCreateSuperCampaignButton(
  bareMode: boolean,
  isTemplateLoaded: boolean,
  isAdmin: boolean,
  isEmailMedium: boolean
): boolean {
  if (bareMode) {
    return false
  }

  return isAdmin && isTemplateLoaded && isEmailMedium
}

/**
 * It returns true if Builder need to have the "Save as template" button
 */
export function hasSaveAsTemplateButton(
  bareMode: boolean,
  isTemplateLoaded: boolean,
  isAdmin: boolean,
  isOpenHouseMedium: boolean
): boolean {
  if (bareMode) {
    return false
  }

  return isAdmin && isTemplateLoaded && !isOpenHouseMedium
}

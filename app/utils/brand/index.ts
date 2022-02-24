export const getBrandSettings = (brand: IBrand): Nullable<IBrandSettings> => {
  if (!brand?.settings) {
    return null
  }

  return brand.settings
}

export const getBrandTheme = (brand: IBrand): Nullable<IBrandTheme> => {
  const brandSettings = getBrandSettings(brand)

  if (!brandSettings?.theme || !brand.settings) {
    return null
  }

  return brand.settings.theme
}

export const getBrandHelpCenterURL = (brand: IBrand): string => {
  const brandSettings = getBrandSettings(brand)

  if (!brandSettings?.help_center) {
    return 'https://help.rechat.com'
  }

  return brandSettings.help_center
}

export const hasBrandCustomTheme = (brand: IBrand): boolean => {
  const theme = brand.settings?.theme

  if (!theme) {
    return false
  }

  const keysToCheck = Object.keys(theme.palette ?? [])

  return keysToCheck.some(key => Object.keys(theme.palette?.[key]).length > 0)
}

export const isBrandADescendantOfAnotherBrand = (
  child: IBrand,
  ancestor: IBrand
): boolean => {
  let currentAncestor: Nullable<IBrand> = child.parent

  while (currentAncestor) {
    if (currentAncestor.id === ancestor.id) {
      return true
    }

    currentAncestor = currentAncestor?.parent
  }

  return false
}

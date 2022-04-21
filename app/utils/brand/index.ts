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

  if (theme?.navbar?.logo?.url) {
    return true
  }

  const paletteKeysToCheck = Object.keys(theme.palette ?? [])

  return paletteKeysToCheck.some(
    key => Object.keys(theme.palette?.[key]).length > 0
  )
}

export const isBrandUnderAncestor = (
  brand: IBrand,
  ancestor: IBrand
): boolean => {
  let currentAncestor: Nullable<IBrand> = brand.parent

  while (currentAncestor) {
    if (currentAncestor.id === ancestor.id) {
      return true
    }

    currentAncestor = currentAncestor?.parent
  }

  return false
}

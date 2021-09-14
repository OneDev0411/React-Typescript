export const getBrandSettings = (brand: IBrand): Nullable<IBrandSettings> => {
  if (!brand?.settings) {
    return null
  }

  return brand.settings
}

export const getBrandTheme = (brand: IBrand): Nullable<IBrandTheme> => {
  const brandSettings = getBrandSettings(brand)

  if (!brandSettings?.theme) {
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

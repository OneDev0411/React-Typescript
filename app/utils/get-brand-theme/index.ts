import { ThemeOptions } from '@material-ui/core'

const hasCustomTheme = (brand: IBrand) => {
  const theme = brand.settings?.theme

  if (!theme) {
    return false
  }

  const keysToCheck = Object.keys(theme.palette ?? [])

  return keysToCheck.some(key => Object.keys(theme.palette?.[key]).length > 0)
}

export const getBrandTheme = (brand?: Nullable<IBrand>): ThemeOptions => {
  if (!brand) {
    return {}
  }

  let currentBrand: Nullable<IBrand> = { ...brand }

  while (currentBrand) {
    if (hasCustomTheme(currentBrand)) {
      return currentBrand.settings?.theme ?? {}
    }

    currentBrand = currentBrand.parent
  }

  return {}
}

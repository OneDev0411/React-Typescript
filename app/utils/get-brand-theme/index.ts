import { ThemeOptions } from '@material-ui/core'

export const getBrandTheme = (brand: IBrand): ThemeOptions => {
  if (!brand?.settings?.theme) {
    return {}
  }

  return brand.settings.theme
}

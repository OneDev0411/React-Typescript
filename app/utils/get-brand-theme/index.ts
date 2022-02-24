import { ThemeOptions } from '@material-ui/core'

import {
  hasBrandCustomTheme,
  isBrandADescendantOfAnotherBrand
} from '@app/utils/brand'

export const getBrandTheme = (
  brand: Nullable<IBrand>,
  hostBrand?: Nullable<IBrand>
): ThemeOptions => {
  // Anonymous user using a custom host to see a property page
  // We do return the host brand theme
  if (hostBrand && !brand) {
    return getBrandTheme(hostBrand)
  }

  // A logged in user without any brand
  // Might happen when the state is not there yet
  // We do return an empty theme to fallback to default theme
  if (!brand) {
    return {}
  }

  // The rest happens if we either:
  // 1. Have a brand passed here. Like when someone's using app.rechat.com
  // 2. We have both brand and the host brand. Like when someone's using a custom domain.
  let currentBrand: Nullable<IBrand> = { ...brand }

  while (currentBrand) {
    // No custom theme, we'll check the next parent
    if (!hasBrandCustomTheme(currentBrand)) {
      currentBrand = currentBrand.parent
      // eslint-disable-next-line no-continue
      continue
    }

    // Custom theme without any host based parent
    if (!hostBrand) {
      return currentBrand.settings?.theme ?? {}
    }

    // Custom theme with host based parent
    // We need to make sure the current brand is a descendant of the host brand
    // We do this to prevent loading another client's theme inside a custom host
    return currentBrand.id === hostBrand.id ||
      isBrandADescendantOfAnotherBrand(currentBrand, hostBrand)
      ? currentBrand.settings?.theme ?? {}
      : {}
  }

  return {}
}

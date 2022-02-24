import { hasBrandCustomTheme, isBrandUnderAncestor } from '@app/utils/brand'

export const getBrandTheme = (
  brand: Nullable<IBrand>,
  hostBrand?: Nullable<IBrand>
): IBrandTheme => {
  const fallbackTheme = hostBrand?.settings?.theme ?? {}

  // A logged in user without any brand
  // Might happen when the state is not lifted up yet
  // We do return an empty theme to fallback to default theme
  if (!brand) {
    return fallbackTheme
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
      // it's app.rechat.com
      return currentBrand.settings?.theme ?? fallbackTheme
    }

    // Custom theme with host based parent
    // We need to make sure the current brand is a descendant of the host brand
    // We do this to prevent loading another client's theme inside a custom host
    if (isBrandUnderAncestor(currentBrand, hostBrand)) {
      return currentBrand.settings?.theme ?? fallbackTheme
    }

    // Having a wrong passed brand which is not a descendant of the host brand
    // We are now falling back to the host brand theme
    return fallbackTheme
  }

  return fallbackTheme
}

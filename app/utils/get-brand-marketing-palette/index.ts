import { hasBrandCustomTheme, isBrandUnderAncestor } from '@app/utils/brand'

export const getBrandMarketingPalette = (
  brand: Nullable<IBrand>,
  hostBrand?: Nullable<IBrand>
): Nullable<BrandMarketingPalette> => {
  const fallbackPalette = hostBrand?.settings?.marketing_palette ?? null

  // A logged in user without any brand
  // Might happen when the state is not lifted up yet
  // We do return an empty palette to fallback to default palette
  if (!brand) {
    return fallbackPalette
  }

  // The rest happens if we either:
  // 1. Have a brand passed here. Like when someone's using app.rechat.com
  // 2. We have both brand and the host brand. Like when someone's using a custom domain.
  let currentBrand: Nullable<IBrand> = { ...brand }

  while (currentBrand) {
    // No custom palette, we'll check the next parent
    if (!hasBrandCustomTheme(currentBrand)) {
      currentBrand = currentBrand.parent
      // eslint-disable-next-line no-continue
      continue
    }

    // Custom palette without any host based parent
    if (!hostBrand) {
      // it's app.rechat.com
      return currentBrand.settings?.marketing_palette ?? fallbackPalette
    }

    // Custom palette with host based parent
    // We need to make sure the current brand is a descendant of the host brand
    // We do this to prevent loading another client's palette inside a custom host
    if (isBrandUnderAncestor(currentBrand, hostBrand)) {
      return currentBrand.settings?.marketing_palette ?? fallbackPalette
    }

    // Having a wrong passed brand which is not a descendant of the host brand
    // We are now falling back to the host brand palette
    return fallbackPalette
  }

  return fallbackPalette
}

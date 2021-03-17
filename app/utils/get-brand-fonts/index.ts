import flattenBrand from 'utils/flatten-brand'

export function getBrandFontFamilies(brand: IBrand): string[] {
  const flattedBrand = flattenBrand(brand)

  if (!flattedBrand?.settings?.marketing_palette) {
    return []
  }

  const brandPalette = flattedBrand.settings.marketing_palette as BrandMarketingPalette

  const fontFamilyKeys = Object.keys(brandPalette).filter(key =>
    key.includes('font-family')
  )
  const brandFontFamilies = fontFamilyKeys.map(key => brandPalette[key])

  return [...new Set(brandFontFamilies)]
}

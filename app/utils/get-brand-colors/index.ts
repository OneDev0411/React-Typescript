import flattenBrand from 'utils/flatten-brand'

const DEFAULT_COLORS = ['#fff', '#ccc', '#999', '#666', '#333', '#000']

export function getBrandColors(brand: IBrand): string[] {
  const flattedBrand = flattenBrand(brand)

  if (
    !flattedBrand ||
    !flattedBrand.settings ||
    !flattedBrand.settings.marketing_palette
  ) {
    return DEFAULT_COLORS
  }

  const brandPalette = flattedBrand.settings.marketing_palette as BrandMarketingPalette

  const colorKeys = Object.keys(brandPalette).filter(key =>
    key.includes('color')
  )
  const brandColors = colorKeys.map(key => brandPalette[key])

  return [...new Set(brandColors)]
}

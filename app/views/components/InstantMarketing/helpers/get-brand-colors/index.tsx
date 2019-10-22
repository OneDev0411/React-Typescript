import flattenBrand from 'utils/flatten-brand'

const SHARED_COLORS = ['#fff', '#ccc', '#999', '#666', '#333', '#000']

export function getBrandColors(brand: IBrand): string[] {
  const flattedBrand = flattenBrand(brand) as IBrand

  if (!flattedBrand.palette) {
    return SHARED_COLORS
  }

  const colors: string[] = []

  if (flattedBrand.palette.primary) {
    colors.push(flattedBrand.palette.primary)
  }

  if (flattedBrand.palette.marketing) {
    if (flattedBrand.palette.marketing.alpha) {
      colors.push(...Object.values(flattedBrand.palette.marketing.alpha))
    }

    if (flattedBrand.palette.marketing.beta) {
      colors.push(...Object.values(flattedBrand.palette.marketing.beta))
    }

    if (flattedBrand.palette.marketing.theta) {
      colors.push(...Object.values(flattedBrand.palette.marketing.theta))
    }
  }

  colors.push(...SHARED_COLORS)

  return [...new Set(colors.map(color => color.toLowerCase()))]
}

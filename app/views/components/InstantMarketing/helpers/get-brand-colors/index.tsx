const GENERIC_COLORS = ['#fff', '#ccc', '#999', '#666', '#333', '#000']

export function getBrandColors(brand: IBrand): string[] {
  const colors: string[] = []

  if (brand.palette.primary) {
    colors.push(brand.palette.primary)
  }

  if (brand.palette.marketing) {
    if (brand.palette.marketing.alpha) {
      colors.push(...Object.values(brand.palette.marketing.alpha))
    }

    if (brand.palette.marketing.beta) {
      colors.push(...Object.values(brand.palette.marketing.beta))
    }

    if (brand.palette.marketing.theta) {
      colors.push(...Object.values(brand.palette.marketing.theta))
    }
  }

  colors.push(...GENERIC_COLORS)

  // unique list of colors
  return [...new Set(colors.map(color => color.toLowerCase()))]
}

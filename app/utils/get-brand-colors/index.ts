const DEFAULT_COLORS = ['#fff', '#ccc', '#999', '#666', '#333', '#000']

export function getBrandColors(brand: IBrand): string[] {
  const colors: string[] = []

  if (brand.settings?.marketing_palette) {
    colors.push(...getColorsFromPalette(brand.settings.marketing_palette))
  }

  while (brand.parent) {
    if (brand.parent.settings?.marketing_palette) {
      colors.push(
        ...getColorsFromPalette(brand.parent.settings.marketing_palette)
      )
    }

    brand = brand.parent
  }

  const uniqueColors = [...new Set(colors)]

  return uniqueColors.length === 0 ? DEFAULT_COLORS : uniqueColors
}

function getColorsFromPalette(palette: BrandMarketingPalette): string[] {
  return Object.keys(palette)
    .filter(key => key.includes('color'))
    .map(key => palette[key])
}

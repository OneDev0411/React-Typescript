export function getBrandFontFamilies(brand: IBrand): string[] {
  const fontFamilies: string[] = []

  if (brand.settings?.marketing_palette) {
    fontFamilies.push(
      ...getFontFamiliesFromPalette(brand.settings.marketing_palette)
    )
  }

  while (brand.parent) {
    if (brand.parent.settings?.marketing_palette) {
      fontFamilies.push(
        ...getFontFamiliesFromPalette(brand.parent.settings.marketing_palette)
      )
    }

    brand = brand.parent
  }

  return [...new Set(fontFamilies)]
}

function getFontFamiliesFromPalette(palette: BrandMarketingPalette): string[] {
  return Object.keys(palette)
    .filter(key => key.includes('font-family'))
    .map(key => palette[key])
}

import merge from 'merge'

export default function flattenBrand(brand) {
  if (!brand) {
    return null
  }

  const brands = [brand]

  while (brand.parent) {
    brands.push(brand.parent)
    brand = brand.parent
  }

  brands.reverse()

  let merged = {}

  brands.forEach(brand_loop => {
    merge.recursive(merged, { ...brand_loop, parent: undefined })
  })

  return merged
}

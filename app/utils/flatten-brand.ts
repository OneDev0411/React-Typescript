import merge from 'merge'

export default function flattenBrand(brand: IBrand): IBrand | null {
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
    /*
     * The true argument is a feature of the merge package.
     * It clones the objects, thus, preventing any mutations.
     */
    merge.recursive(true, merged, { ...brand_loop, parent: undefined })
  })

  return merged as IBrand
}

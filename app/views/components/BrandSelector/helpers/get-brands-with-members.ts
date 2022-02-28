/**
 * Returns the list of brands which has at least one member
 * @param brands list of brand
 * @returns The list of brands
 */
export function getBrandsWithMembers(brands: Nullable<IBrand[]>): IBrand[] {
  if (!brands) {
    return []
  }

  return brands
    .filter(
      brand => brand.member_count > 0 || (brand.children || []).length > 0
    )
    .map(brand => {
      if (brand.children) {
        brand.children = getBrandsWithMembers(brand.children)
      }

      return brand
    })
}

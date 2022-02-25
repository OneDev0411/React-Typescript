const defaultTypes: IBrandType[] = ['Brokerage', 'Region', 'Other']

/**
 * Returns the list of brand id which should be expand on brand selector
 * @param brands list of brand
 * @param types selected types
 * @returns The list of brand id
 */
export function getExpandBrandsByType(
  brands: IBrand[],
  types: IBrandType[] = defaultTypes
): UUID[] {
  return brands.reduce((acc: UUID[], brand: IBrand) => {
    if (brand.children && types.includes(brand.brand_type)) {
      const childNodeIds = getExpandBrandsByType(brand.children, types)

      return [...acc, brand.id, ...childNodeIds]
    }

    return acc
  }, [])
}

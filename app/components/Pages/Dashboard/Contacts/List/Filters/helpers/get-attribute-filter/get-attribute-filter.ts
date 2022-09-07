import { getFilterValues } from './get-filter-values'

export const getAttributeFilter = (
  filter: IContactAttributeFilter,
  attribute: IContactAttributeDef
) => {
  return {
    id: filter.attribute_def,
    isActive: false,
    values: getFilterValues(filter.value, attribute),
    operator: {
      name: filter.invert ? 'is not' : 'is',
      invert: filter.invert
    }
  }
}

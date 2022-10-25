import { getFilterOperator } from './get-filter-operator'
import { getFilterValues } from './get-filter-values'

export const getAttributeFilter = (
  filter: IContactAttributeFilter,
  attribute: IContactAttributeDef
): IActiveFilter => {
  return {
    id: filter.attribute_def!,
    isActive: false,
    values: getFilterValues(filter.value, attribute),
    operator: getFilterOperator(filter, attribute)
  }
}

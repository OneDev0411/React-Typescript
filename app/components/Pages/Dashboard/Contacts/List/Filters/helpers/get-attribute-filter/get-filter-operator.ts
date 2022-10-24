import { operators as dateOperators } from '@app/views/components/Grid/Filters/FilterTypes/Date/constant'

export const getFilterOperator = (
  filter: IContactAttributeFilter,
  attribute: IContactAttributeDef
): IActiveFilter['operator'] => {
  const operator: Partial<IFilterOperator> = {}

  if (filter.invert !== undefined) {
    operator.invert = filter.invert === true
  }

  if (filter.operator !== undefined) {
    operator.operator = filter.operator
  }

  if (attribute.data_type === 'date') {
    const dateOperatorName =
      dateOperators.find(operator => {
        if (operator.invert !== undefined) {
          return (
            operator.operator === filter.operator &&
            operator.invert === filter.invert
          )
        }

        return operator.operator === filter.operator
      })?.name ?? dateOperators[0].name

    operator.name = dateOperatorName

    return operator as IFilterOperator
  }

  operator.name = filter.invert ? 'is not' : 'is'

  return operator as IFilterOperator
}

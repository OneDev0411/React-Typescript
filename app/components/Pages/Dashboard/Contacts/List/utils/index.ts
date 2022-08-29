import _ from 'underscore'

import { FLOW_FILTER_ID, OPEN_HOUSE_FILTER_ID } from 'crm/List/constants'

export const normalizeAttributeFilters = (
  filters: StringMap<IActiveFilter>
): IContactAttributeFilter[] => {
  const criteria: IContactAttributeFilter[] = []

  _.each(filters, filter => {
    if (isAttributeFilter(filter)) {
      _.each(filter.values, ({ value }) => {
        const nextFilter: IContactAttributeFilter = {
          attribute_def: filter.id,
          value
        }
        const operator = filter.operator ?? {}

        if (operator.invert !== undefined) {
          nextFilter.invert = filter.operator.invert === true
        }

        if (operator.operator !== undefined) {
          nextFilter.operator = operator.operator
        }

        criteria.push(nextFilter)
      })
    }
  })

  return criteria
}

export function isAttributeFilter(filter) {
  return ![OPEN_HOUSE_FILTER_ID, FLOW_FILTER_ID].includes(filter.id)
}

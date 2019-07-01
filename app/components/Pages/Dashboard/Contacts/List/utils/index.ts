import _ from 'underscore'

import { FLOW_FILTER_ID, OPEN_HOUSE_FILTER_ID } from 'crm/List/constants'

export function normalizeAttributeFilters(filters: IActiveFilter[]) {
  const criteria: IContactAttributeFilter[] = []

  _.each(filters.filter(isAttributeFilter), filter => {
    _.each(filter.values, ({ value }) => {
      criteria.push({
        value,
        invert: filter.operator.invert === true,
        attribute_def: filter.id
      })
    })
  })

  return criteria
}

export function isAttributeFilter(filter) {
  return ![OPEN_HOUSE_FILTER_ID, FLOW_FILTER_ID].includes(filter.id)
}

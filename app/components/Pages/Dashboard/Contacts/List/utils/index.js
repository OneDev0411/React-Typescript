import _ from 'underscore'

export function normalizeFilters(filters) {
  const criteria = []

  _.each(filters, filter => {
    _.each(filter.values, value => {
      criteria.push({
        value,
        invert: filter.operator.invert === true,
        attribute_def: filter.id
      })
    })
  })

  return criteria
}

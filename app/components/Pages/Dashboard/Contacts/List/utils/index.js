import _ from 'underscore'

export function normalizeFilters(filters) {
  const criteria = []

  _.each(filters, filter => {
    _.each(filter.values, ({ value }) => {
      criteria.push(
        getFilter(value, filter.operator.invert === true, filter.id)
      )
    })
  })

  return criteria
}

function getFilter(value, invert, filterId) {
  switch (filterId) {
    case 'openHouse':
      return {
        value,
        invert,
        crm_task: filterId
      }
    default:
      return {
        value,
        invert,
        attribute_def: filterId
      }
  }
}

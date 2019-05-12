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
        invert,
        crm_task: value
      }
    case 'flow':
      return {
        invert,
        flow: value
      }
    default:
      return {
        value,
        invert,
        attribute_def: filterId
      }
  }
}

import _ from 'underscore'

function getCriteriaParams(config, id) {
  return _.find(config, {
    id
  }).additionalParams
}

export default function(filters, config) {
  const criteria = []

  _.each(filters, filter => {
    if (filter.isIncomplete) {
      return false
    }

    _.each(filter.values, value => {
      criteria.push({
        value,
        invert: filter.operator.invert === true,
        ...getCriteriaParams(config, filter.id)
      })
    })
  })

  return criteria
}

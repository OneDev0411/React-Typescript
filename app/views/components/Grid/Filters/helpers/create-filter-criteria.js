import _ from 'underscore'

function isNegativeOperator(operator) {
  return ['is-not'].includes(operator.id)
}

function getCriteriaParams(config, filterName) {
  return _.find(config, {
    name: filterName
  }).criteriaParams
}

export default function(filters, config) {
  const criteria = []

  _.each(filters, filter => {
    if (filter.isIncomplete) {
      return false
    }

    _.each(filter.conditions, condition => {
      criteria.push({
        value: condition.value,
        invert: isNegativeOperator(filter.operator),
        ...getCriteriaParams(config, filter.name)
      })
    })
  })

  return criteria
}

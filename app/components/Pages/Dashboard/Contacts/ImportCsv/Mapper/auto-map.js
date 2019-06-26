import each from 'lodash/each'
import filter from 'lodash/filter'
import some from 'lodash/some'

import { compareTwoStrings } from 'utils/dice-coefficient'

import { isAddressField } from '../helpers/address'

export function automaticMapping(csvColoumns, attributeDefs) {
  const mappedFields = {}

  each(csvColoumns, ({ name: columnName }) => {
    let index = 0
    const attribute = findMatchedAttribute(columnName, attributeDefs)

    if (!attribute) {
      return false
    }

    const isSingular = attributeDefs.byId[attribute.id]
    const isAddress = isAddressField(attributeDefs, attribute.id)

    // singular attrs can't be mapped more than once
    if (
      isSingular &&
      some(mappedFields, field => field.definitionId === attribute.id)
    ) {
      return false
    }

    if (isAddress) {
      index = filter(
        mappedFields,
        ({ definitionId }) => definitionId === attribute.id
      ).length
    }

    mappedFields[columnName] = {
      definitionId: attribute.id,
      index
    }
  })

  return mappedFields
}

/**
 * find most similar attribute for given csv column name
 * based on sorenson algorithm
 */
function findMatchedAttribute(csvColoumnName, attributeDefs) {
  const list = []

  _.some(attributeDefs.byId, definition => {
    const rate = compareTwoStrings(
      csvColoumnName.toLowerCase(),
      definition.label.toLowerCase()
    )

    list.push({
      id: definition.id,
      label: definition.label,
      rate
    })

    if (rate === 1) {
      return true
    }
  })

  if (list.length === 0) {
    return null
  }

  const bestMatches = _.sortBy(list, item => item.rate * -1)
  const bestMatch = bestMatches[0]

  if (bestMatch.rate > 0.32) {
    return bestMatch
  }

  return null
}

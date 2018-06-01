import React from 'react'
import _ from 'underscore'

import { FilterOperators } from '../../Oparators'

export const filterOperators = [
  {
    id: 'is',
    name: 'is',
    componentType: 'List',
    defaultSelected: true
  },
  {
    id: 'is-not',
    name: 'is not',
    componentType: 'List'
  }
]

function getNormalizedOptions(options) {
  return options.map(item => {
    if (typeof item === 'object') {
      return _.pick(item, 'name', 'value')
    }

    return {
      name: item,
      value: item
    }
  })
}

export const ListFilter = props => (
  <FilterOperators
    operators={props.operators || filterOperators}
    options={getNormalizedOptions(props.options)}
    defaultValue={props.defaultValue}
    allowMultipleSelections={props.multi}
    onFilterChange={props.onFilterChange}
    currentFilters={props.currentFilters}
    currentOperator={props.currentOperator}
  />
)

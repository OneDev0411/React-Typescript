import React from 'react'
import _ from 'underscore'

import { FilterOperators } from '../../Oparators'

export const operators = [
  {
    name: 'is',
    default: true
  },
  {
    name: 'is not',
    invert: true
  }
]

export const ListFilter = props => (
  <FilterOperators
    type={props.type}
    allowedOperators={operators}
    options={props.options}
    defaultValue={props.defaultValue}
    allowMultipleSelections={props.multi}
    onFilterChange={props.onFilterChange}
    values={props.values}
    operator={props.operator}
  />
)

import React from 'react'

import { OperatorAndOperandFilter } from '.'

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
export const operatorAndOperandFilterRenderer = ({
  options = [],
  getOptions = null,
  type = 'Set',
  multi = false,
  allowedOperators = operators,
  defaultValue
}) => ({ onFilterChange, values, operator, onToggleFilterActive }) => (
  <OperatorAndOperandFilter
    type={type}
    allowedOperators={allowedOperators}
    options={options}
    getOptions={getOptions}
    defaultValue={defaultValue}
    allowMultipleSelections={multi}
    onFilterChange={onFilterChange}
    values={values}
    operator={operator}
    onToggleFilterActive={onToggleFilterActive}
  />
)

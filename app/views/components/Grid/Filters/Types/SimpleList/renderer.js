import React from 'react'

import { SimpleList } from '.'

export const simpleListFilterRenderer = ({ options, getOptions }) => ({
  onFilterChange,
  values,
  operator,
  onToggleFilterActive
}) => (
  <SimpleList
    options={options}
    getOptions={getOptions}
    onFilterChange={onFilterChange}
    values={values}
    operator={operator}
    onToggleFilterActive={onToggleFilterActive}
  />
)

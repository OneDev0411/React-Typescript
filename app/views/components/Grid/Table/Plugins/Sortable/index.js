import React from 'react'
import _ from 'underscore'

import { BasicDropdown } from 'components/BasicDropdown'

export class SortablePlugin {
  constructor({ options, onRequestForceUpdate }) {
    this.options = {
      defaultIndex: {
        label: 'Sort by',
        value: 'Sort by'
      },
      ...options
    }
    this.onRequestForceUpdate = onRequestForceUpdate

    this.sortBy = null
    this.isAscendingSort = true
  }

  sort = ({ columns, data, sortBy, isAscendingSort, resolveAccessor }) => {
    const sortColumn = this.getSortColumn(columns, sortBy)
    const sort = this.getSortFn(columns, sortBy)

    const sortedData = _.sortBy(data, (row, index) =>
      sort({
        accessor: resolveAccessor(sortColumn.accessor, row, index),
        row,
        index
      })
    )

    return isAscendingSort ? sortedData : sortedData.reverse()
  }

  getSortFn = (columns, sortBy) => {
    const column = this.getSortColumn(columns, sortBy)

    return column.sortMethod || this.defaultSortMethod
  }

  getSortColumn = (columns, sortBy) => columns.find(col => col.id === sortBy.id)

  defaultSortMethod = ({ accessor }) => {
    if (typeof accessor === 'number') {
      return accessor
    }

    if (!accessor) {
      return -Infinity
    }

    return accessor.toString().toLowerCase()
  }

  changeSort = (cell, isAscending) => {
    this.isAscendingSort = isAscending
    this.sortBy = cell

    this.onRequestForceUpdate()
  }

  getSortedData = (data, columns, resolveAccessor) => {
    const { sortBy, isAscendingSort } = this

    if (!sortBy) {
      return data
    }

    return this.sort({
      columns,
      data,
      sortBy,
      isAscendingSort,
      resolveAccessor
    })
  }

  getSortableColumns = columns => {
    const list = []

    if (Array.isArray(this.options.columns)) {
      return this.options.columns
    }

    columns.forEach(col => {
      if (col.sortable === false || !col.header) {
        return false
      }

      list.push(
        {
          column: col,
          label: `${col.header} A-Z`,
          value: col.id,
          ascending: true
        },
        {
          column: col,
          label: `${col.header} Z-A`,
          value: `-${col.id}`,
          ascending: false
        }
      )
    })

    return list
  }

  render = (columns, isFetching) => (
    <BasicDropdown
      maxHeight={400}
      noBorder
      buttonSize="small"
      buttonStyle={{ fontWeight: 500 }}
      defaultSelectedItem={this.options.defaultIndex}
      disabled={isFetching}
      items={this.getSortableColumns(columns)}
      itemToString={item => item.label}
      onChange={item => {
        if (this.options.onChange) {
          return this.options.onChange(item)
        }

        this.changeSort(item.column, item.ascending)
      }}
      menuStyle={{ right: 0, left: 'auto' }}
    />
  )
}

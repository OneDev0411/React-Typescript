import _ from 'underscore'

function sort({ columns, data, sortBy, isAscendingSort, resolveAccessor }) {
  const sortColumn = getSortColumn(columns, sortBy)
  const sort = getSortFn(columns, sortBy)

  const sortedData = _.sortBy(data, (row, index) =>
    sort({
      accessor: resolveAccessor(sortColumn.accessor, row, index),
      row,
      index
    })
  )

  return isAscendingSort ? sortedData : sortedData.reverse()
}

function getSortFn(columns, sortBy) {
  const column = getSortColumn(columns, sortBy)

  return column.sortMethod || defaultSortMethod
}

function getSortColumn(columns, sortBy) {
  return columns.find(col => col.id === sortBy.id)
}

function defaultSortMethod({ accessor }) {
  if (accessor === null || typeof accessor === 'undefined') {
    return -1
  }

  if (typeof accessor === 'number') {
    return accessor
  }

  return accessor.toString().toLowerCase()
}

export default sort

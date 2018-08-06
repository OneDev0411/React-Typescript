import _ from 'underscore'

export class SortablePlugin {
  constructor({ options, onChange }) {
    this.options = options
    this.onChange = onChange

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

  defaultSortMethod = ({ accessor }) =>
    accessor && accessor.toString().toLowerCase()

  changeSort = cell => {
    this.isAscendingSort = !(
      this.isAscendingSort &&
      this.sortBy &&
      this.sortBy.id === cell.id
    )
    this.sortBy = cell

    this.onChange({
      sortBy: this.sortBy,
      isAscendingSort: this.isAscendingSort
    })
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
}

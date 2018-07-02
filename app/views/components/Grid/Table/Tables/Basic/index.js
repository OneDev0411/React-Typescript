import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { BodyCell, BodyRow } from '../../styled'
import TableHeader from '../../Header'

import sortData from '../../Plugins/Sorting'

class BasicTable extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    getTrProps: PropTypes.func,
    getTdProps: PropTypes.func,
    showTableHeader: PropTypes.bool
  }

  static defaultProps = {
    isFetching: false,
    getTrProps: () => {},
    getTdProps: () => {},
    showTableHeader: true
  }

  state = {
    sortBy: null,
    isAscendingSort: true
  }

  handleClickHeaderCell = cell => {
    const { sortBy, isAscendingSort } = this.state

    this.setState({
      sortBy: cell,
      isAscendingSort: !(isAscendingSort && sortBy && sortBy.id === cell.id)
    })
  }

  getSortedData = data => {
    const { columns } = this.props
    const { sortBy, isAscendingSort } = this.state

    if (!sortBy) {
      return data
    }

    return sortData({
      data,
      columns,
      sortBy,
      isAscendingSort,
      resolveAccessor: this.resolveAccessor
    })
  }

  getCell = ({ column, row, rowIndex, total }) => {
    if (column.render) {
      return column.render({
        rowData: row,
        totalRows: total,
        rowIndex
      })
    }

    if (column.accessor) {
      return this.resolveAccessor(column.accessor, row, rowIndex)
    }

    return ''
  }

  resolveAccessor = (accessor, rowData, rowIndex) => {
    if (!accessor) {
      return rowIndex
    }

    if (typeof accessor === 'string') {
      return rowData[accessor]
    }

    if (typeof accessor === 'function') {
      return accessor(rowData)
    }

    return rowIndex
  }

  render() {
    const {
      data,
      columns,
      sizes,
      isFetching,
      EmptyState,
      LoadingState,
      getTrProps,
      getTdProps,
      showTableHeader,
      SubComponent
    } = this.props

    if (data.length === 0 && !isFetching) {
      return <EmptyState />
    }

    return (
      <Fragment>
        {showTableHeader && (
          <TableHeader
            sortBy={this.state.sortBy}
            isAscending={this.state.isAscendingSort}
            columns={columns}
            sizes={sizes}
            onClickCell={this.handleClickHeaderCell}
          />
        )}

        {isFetching && <LoadingState />}
        {SubComponent && <SubComponent data={data} columns={columns} />}

        {this.getSortedData(data).map((row, rowIndex) => (
          <BodyRow
            key={row.key || rowIndex}
            firstRow={rowIndex === 0}
            lastRow={rowIndex === data.length - 1}
            {...getTrProps(rowIndex, {
              original: row
            })}
          >
            {columns &&
              columns.map((column, colIndex) => (
                <BodyCell
                  key={column.id || colIndex}
                  width={sizes[colIndex]}
                  {...getTdProps(colIndex, {
                    column,
                    rowIndex,
                    rowData: row
                  })}
                >
                  {this.getCell({
                    column,
                    row,
                    rowIndex,
                    total: data.length
                  })}
                </BodyCell>
              ))}
          </BodyRow>
        ))}
      </Fragment>
    )
  }
}

export default BasicTable

import React, { Fragment } from 'react'

import { Cell, TBody, BodyRow as Row } from '../../styled'
import TableHeader from '../../Header'

class BasicTable extends React.Component {
  get Rows() {
    const { data, columns, sortablePlugin } = this.props

    if (sortablePlugin) {
      return sortablePlugin.getSortedData(data, columns, this.resolveAccessor)
    }

    return data
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
      isFetchingMore,
      getHeaderProps,
      getHeaderRowProps,
      getBodyProps,
      getTrProps,
      getTdProps,
      showTableHeader,
      plugins,
      EmptyState,
      LoadingState,
      SubComponent,
      multiple
    } = this.props

    if (data.length === 0 && EmptyState && !isFetching) {
      return <EmptyState />
    }

    return (
      <Fragment>
        {showTableHeader && (
          <TableHeader
            columns={columns}
            sizes={sizes}
            plugins={plugins}
            getHeaderProps={getHeaderProps}
            getHeaderRowProps={getHeaderRowProps}
            selectablePlugin={this.props.selectablePlugin}
            sortablePlugin={this.props.sortablePlugin}
          />
        )}

        <TBody {...getBodyProps()}>
          {isFetching && !isFetchingMore && <LoadingState />}
          {SubComponent && <SubComponent data={data} columns={columns} />}

          {this.Rows.map((row, rowIndex) => (
            <Row
              multiple={multiple}
              key={row.key || rowIndex}
              firstRow={rowIndex === 0}
              lastRow={rowIndex === data.length - 1}
              {...getTrProps(rowIndex, {
                original: row,
                isSelected: this.props.selectablePlugin
                  ? this.props.selectablePlugin.isRowSelected(row.id)
                  : false
              })}
            >
              {columns &&
                columns.map((column, colIndex) => (
                  <Cell
                    key={column.id || colIndex}
                    width={sizes[colIndex]}
                    verticalAlign={column.verticalAlign}
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
                  </Cell>
                ))}
            </Row>
          ))}

          {isFetchingMore && <LoadingState isFetchingMore />}
        </TBody>
      </Fragment>
    )
  }
}

export default BasicTable

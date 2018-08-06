import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { BodyCell as Cell, BodyRow as Row } from '../../styled'
import TableHeader from '../../Header'

import { CheckBoxButton, SelectablePlugin } from '../../Plugins/Selectable'
import { SortablePlugin } from '../../Plugins/Sortable'

class BasicTable extends React.Component {
  constructor(props) {
    super(props)

    const { plugins } = props

    if (plugins.sortable) {
      this.sortablePlugin = new SortablePlugin({
        options: this.props.plugins.sortable,
        onChange: () => this.forceUpdate()
      })
    }

    if (plugins.selectable) {
      this.selectablePlugin = new SelectablePlugin({
        options: this.props.plugins.selectable,
        onChange: this.onChangeSelectedRows
      })
    }
  }

  onChangeSelectedRows = params => {
    const { forceUpdate, selectedRows, selectAllRows } = params
    const { plugins, data } = this.props

    if (plugins.selectable.onChange) {
      plugins.selectable.onChange(
        selectAllRows
          ? data.map(row => ({
              id: row.id
            }))
          : selectedRows
      )
    }

    if (forceUpdate) {
      this.forceUpdate()
    }
  }

  get Rows() {
    const { data, columns } = this.props

    if (this.sortablePlugin) {
      return this.sortablePlugin.getSortedData(
        data,
        columns,
        this.resolveAccessor
      )
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
      getHeaderProps,
      getHeaderRowProps,
      getTrProps,
      getTdProps,
      showTableHeader,
      plugins,
      EmptyState,
      LoadingState,
      SubComponent
    } = this.props

    if (EmptyState && data.length === 0 && !isFetching) {
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
            selectablePlugin={this.selectablePlugin}
            sortablePlugin={this.sortablePlugin}
          />
        )}

        {isFetching && <LoadingState />}
        {SubComponent && <SubComponent data={data} columns={columns} />}

        {this.Rows.map((row, rowIndex) => (
          <Row
            key={row.key || rowIndex}
            firstRow={rowIndex === 0}
            lastRow={rowIndex === data.length - 1}
            {...getTrProps(rowIndex, {
              original: row
            })}
          >
            {plugins.selectable && (
              <Cell>
                <CheckBoxButton
                  onClick={() => this.selectablePlugin.toggleSelectRow(row.id)}
                  isSelected={
                    this.selectablePlugin.isAllRowsSelected() ||
                    this.selectablePlugin.isRowSelected(row.id)
                  }
                />
              </Cell>
            )}

            {columns &&
              columns.map((column, colIndex) => (
                <Cell
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
                </Cell>
              ))}
          </Row>
        ))}
      </Fragment>
    )
  }
}

BasicTable.propTypes = {
  isFetching: PropTypes.bool,
  showTableHeader: PropTypes.bool,
  getTrProps: PropTypes.func,
  getTdProps: PropTypes.func,
  plugins: PropTypes.object
}

BasicTable.defaultProps = {
  isFetching: false,
  showTableHeader: true,
  getTrProps: () => {},
  getTdProps: () => {},
  plugins: {}
}

export default BasicTable

import React from 'react'
import PropTypes from 'prop-types'

import { Container } from './styled'

import BasicTable from './Tables/Basic'
import MultipleTable from './Tables/Multiple'

import { SelectablePlugin } from './Plugins/Selectable'
import { SortablePlugin } from './Plugins/Sortable'

class Grid extends React.Component {
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

    if (forceUpdate) {
      this.forceUpdate()
    }

    if (plugins.selectable.onChange) {
      plugins.selectable.onChange(
        selectAllRows
          ? data.map(row => ({
              id: row.id
            }))
          : selectedRows
      )
    }
  }

  /**
   * calculate width of every cell
   */
  get RowsSize() {
    const columns = this.Columns

    const flexibleCellsCount = columns.filter(col => !col.width).length

    if (flexibleCellsCount === columns.length) {
      return columns.map(() => `${100 / columns.length}%`)
    }

    const calc = columns
      .filter(col => col.width)
      .map(col => col.width)
      .join(' + ')

    return columns.map(
      col => col.width || `calc((100% - (${calc})) / ${flexibleCellsCount})`
    )
  }

  get Columns() {
    const { columns } = this.props
    let selectableColumn

    if (this.selectablePlugin) {
      selectableColumn = {
        id: 'plugin--selectable',
        width: '40px',
        header: () => this.selectablePlugin.renderHeader(),
        render: ({ rowData }) => this.selectablePlugin.renderCell(rowData)
      }
    }

    return [selectableColumn, ...columns]
  }

  render() {
    const { multiple, onTableRef } = this.props
    const sizes = this.RowsSize

    if (multiple) {
      return (
        <Container>
          <MultipleTable
            {...this.props}
            columns={this.Columns}
            sizes={sizes}
            onTableRef={onTableRef}
            selectablePlugin={this.selectablePlugin}
            sortablePlugin={this.sortablePlugin}
          />
        </Container>
      )
    }

    return (
      <Container>
        <BasicTable
          {...this.props}
          columns={this.Columns}
          sizes={sizes}
          selectablePlugin={this.selectablePlugin}
          sortablePlugin={this.sortablePlugin}
        />
      </Container>
    )
  }
}

Grid.propTypes = {
  plugins: PropTypes.object
  // columns: PropTypes.func.isRequired,
  // data: PropTypes.func.isRequired
}

Grid.defaultProps = {
  plugins: {}
}

export default Grid

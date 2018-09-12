import React from 'react'
import PropTypes from 'prop-types'

import {
  ToolbarContainer,
  ActionsBar,
  LeftActions,
  RightActions
} from './styled'

import BasicTable from './Tables/Basic'
import MultipleTable from './Tables/Multiple'

import { SelectablePlugin } from './Plugins/Selectable'
import { SortablePlugin } from './Plugins/Sortable'
import { LoadablePlugin } from './Plugins/Loadable'
import { ActionablePlugin } from './Plugins/Actionable'

import { TableSummary } from './TableSummary'

class Grid extends React.Component {
  constructor(props) {
    super(props)

    const { plugins } = props

    if (plugins.sortable) {
      this.sortablePlugin = new SortablePlugin({
        options: plugins.sortable,
        onRequestForceUpdate: () => this.forceUpdate()
      })
    }

    if (plugins.selectable) {
      this.selectablePlugin = new SelectablePlugin({
        options: plugins.selectable,
        onRequestForceUpdate: () => this.forceUpdate()
      })
    }

    if (plugins.loadable) {
      this.loadablePlugin = new LoadablePlugin({
        options: plugins.loadable
      })
    }

    if (plugins.actionable) {
      this.actionablePlugin = new ActionablePlugin({
        leftActions: plugins.actionable.leftActions,
        rightActions: plugins.actionable.rightActions,
        selectablePlugin: this.selectablePlugin
      })
    }
  }

  componentDidMount() {
    this.selectablePlugin && this.selectablePlugin.setData(this.props.data)
  }

  componentWillReceiveProps({ data }) {
    this.selectablePlugin && this.selectablePlugin.setData(data)
  }

  componentWillUnmount() {
    this.loadablePlugin && this.loadablePlugin.unregister()
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
    let columnsWithPlugins = this.props.columns

    if (this.selectablePlugin) {
      columnsWithPlugins = this.selectablePlugin.registerColumn(
        columnsWithPlugins
      )
    }

    return columnsWithPlugins
  }

  render() {
    const { multiple, onTableRef } = this.props
    const sizes = this.RowsSize

    if (multiple) {
      return (
        <div>
          <MultipleTable
            {...this.props}
            columns={this.Columns}
            sizes={sizes}
            onTableRef={onTableRef}
            selectablePlugin={this.selectablePlugin}
            sortablePlugin={this.sortablePlugin}
          />
        </div>
      )
    }

    return (
      <div>
        {(Object.keys(this.props.summary).length > 0 ||
          this.actionablePlugin) && (
          <ToolbarContainer>
            <TableSummary {...this.props.summary} />

            {this.actionablePlugin && (
              <ActionsBar>
                <LeftActions>
                  {this.actionablePlugin.renderLeftActions()}
                </LeftActions>
                <RightActions>
                  {this.actionablePlugin.renderRightActions()}
                </RightActions>
              </ActionsBar>
            )}
          </ToolbarContainer>
        )}

        <BasicTable
          {...this.props}
          columns={this.Columns}
          sizes={sizes}
          selectablePlugin={this.selectablePlugin}
          sortablePlugin={this.sortablePlugin}
        />
      </div>
    )
  }
}

Grid.propTypes = {
  Actions: PropTypes.element,
  plugins: PropTypes.object,
  isFetching: PropTypes.bool,
  isFetchingMore: PropTypes.bool,
  showTableHeader: PropTypes.bool,
  getTrProps: PropTypes.func,
  getTdProps: PropTypes.func,
  onScrollBottom: PropTypes.func,
  onScrollTop: PropTypes.func,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  summary: PropTypes.object
}

Grid.defaultProps = {
  isFetching: false,
  isFetchingMore: false,
  showTableHeader: true,
  getTrProps: () => {},
  getTdProps: () => {},
  onScrollBottom: () => {},
  onScrollTop: () => {},
  plugins: {},
  data: [],
  summary: {}
}

export default Grid

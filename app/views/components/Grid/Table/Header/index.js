import React from 'react'
import PropTypes from 'prop-types'

import { Header, HeaderRow, HeaderCell } from './styled'

import SortIndicator from '../Plugins/Sortable/Indicator'
import { CheckBoxButton } from '../Plugins/Selectable'

function isSortable(sortablePlugin, column) {
  return sortablePlugin && column.isSortable !== false && column.header
}

const TableHeader = ({
  columns,
  sizes,
  plugins,
  getHeaderProps,
  getHeaderRowProps,
  selectablePlugin,
  sortablePlugin
}) => (
  <Header {...getHeaderProps()}>
    <HeaderRow {...getHeaderRowProps()}>
      {plugins.selectable && (
        <HeaderCell>
          <CheckBoxButton
            onClick={selectablePlugin.toggleSelectAllRows}
            isSelected={selectablePlugin.isAllRowsSelected()}
          />
        </HeaderCell>
      )}

      {columns &&
        columns.map((col, index) => (
          <HeaderCell
            key={col.id || index}
            width={sizes[index]}
            isSortable={isSortable(sortablePlugin, col)}
            onClick={() =>
              isSortable(sortablePlugin, col) && sortablePlugin.changeSort(col)
            }
          >
            {col.header}

            <SortIndicator
              column={col}
              // sortBy={sortBy}
              // isAscending={isAscending}
            />
          </HeaderCell>
        ))}
    </HeaderRow>
  </Header>
)

TableHeader.propTypes = {
  columns: PropTypes.array.isRequired,
  sizes: PropTypes.array.isRequired,
  onClickCell: PropTypes.func,
  getHeaderProps: PropTypes.func,
  getHeaderRowProps: PropTypes.func
}

TableHeader.defaultProps = {
  onClickCell: () => {},
  getHeaderProps: () => {},
  getHeaderRowProps: () => {}
}

export default TableHeader

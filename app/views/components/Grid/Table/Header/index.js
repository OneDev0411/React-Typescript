import React from 'react'
import PropTypes from 'prop-types'

import { Header, HeaderRow, HeaderCell } from './styled'

import SortIndicator from '../Plugins/Sortable/Indicator'

const TableHeader = ({
  columns,
  sizes,
  getHeaderProps,
  getHeaderRowProps,
  sortablePlugin
}) => (
  <Header {...getHeaderProps()}>
    <HeaderRow {...getHeaderRowProps()}>
      {columns &&
        columns.map((column, index) => (
          <HeaderCell key={column.id || index} width={sizes[index]}>
            {typeof column.header === 'function'
              ? column.header(column, index)
              : column.header}

            {sortablePlugin && (
              <SortIndicator
                column={column}
                sortBy={sortablePlugin.sortBy}
                isAscending={sortablePlugin.isAscendingSort}
              />
            )}
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

import React from 'react'
import PropTypes from 'prop-types'

import { Header, HeaderRow, HeaderCell } from './styled'

import SortIndicator from '../Plugins/Sorting/Indicator'

function isSortable(column) {
  return column.isSortable !== false && column.header
}

const TableHeader = ({
  columns,
  sizes,
  sortBy,
  isAscending,
  onClickCell,
  getHeaderProps,
  getHeaderRowProps
}) => (
  <Header {...getHeaderProps()}>
    <HeaderRow {...getHeaderRowProps()}>
      {columns &&
        columns.map((col, index) => (
          <HeaderCell
            key={col.id || index}
            width={sizes[index]}
            isSortable={isSortable(col)}
            onClick={() => isSortable(col) && onClickCell(col)}
          >
            {col.header}

            <SortIndicator
              column={col}
              sortBy={sortBy}
              isAscending={isAscending}
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

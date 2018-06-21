import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { BodyCell, BodyRow } from '../../styled'

const BasicTable = ({ data, columns, sizes, emptyState, getTrProps }) => {
  if (data.length === 0) {
    return emptyState
  }

  return (
    <Fragment>
      {data.map((row, rowIndex) => (
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
              <BodyCell key={column.id || colIndex} width={sizes[colIndex]}>
                {column.render &&
                  column.render({
                    rowData: row
                  })}
              </BodyCell>
            ))}
        </BodyRow>
      ))}
    </Fragment>
  )
}

BasicTable.propTypes = {
  getTrProps: PropTypes.func
}

BasicTable.defaultProps = {
  getTrProps: () => {}
}

export default BasicTable

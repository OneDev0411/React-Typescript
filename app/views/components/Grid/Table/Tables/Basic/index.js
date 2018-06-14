import React, { Fragment } from 'react'
import { BodyCell, BodyRow } from '../../styled'

const BasicTable = ({ data, columns, sizes, emptyState }) => {
  if (data.length === 0) {
    return emptyState
  }

  return (
    <Fragment>
      {data.map((row, rowIndex) => (
        <BodyRow
          key={row.id || rowIndex}
          firstRow={rowIndex === 0}
          lastRow={rowIndex === data.length - 1}
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

export default BasicTable

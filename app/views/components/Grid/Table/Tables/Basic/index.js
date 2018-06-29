import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { BodyCell, BodyRow } from '../../styled'

const BasicTable = ({
  data,
  columns,
  sizes,
  isFetching,
  EmptyState,
  LoadingState,
  getTrProps,
  getTdProps,
  SubComponent
}) => {
  if (data.length === 0 && !isFetching) {
    return <EmptyState />
  }

  return (
    <Fragment>
      {isFetching && <LoadingState />}
      {SubComponent && <SubComponent data={data} columns={columns} />}

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
              <BodyCell
                key={column.id || colIndex}
                width={sizes[colIndex]}
                {...getTdProps(colIndex, {
                  column,
                  rowIndex,
                  rowData: row
                })}
              >
                {column.render &&
                  column.render({
                    rowData: row,
                    totalRows: data.length,
                    rowIndex
                  })}
              </BodyCell>
            ))}
        </BodyRow>
      ))}
    </Fragment>
  )
}

BasicTable.propTypes = {
  isFetching: PropTypes.bool,
  getTrProps: PropTypes.func,
  getTdProps: PropTypes.func
}

BasicTable.defaultProps = {
  isFetching: false,
  getTrProps: () => {},
  getTdProps: () => {}
}

export default BasicTable

import React, { Fragment } from 'react'
import styled from 'styled-components'

import { grey } from '../../../../utils/colors'

const Title = styled.div`
  font-weight: 500;
  color: ${grey.A900};
`

export const TableSummary = ({
  Component,
  style,
  entityName,
  selectedRowsCount,
  totalRowsCount
}) => {
  if (!Component && entityName) {
    return (
      <Title style={style}>
        {selectedRowsCount > 0 ? (
          <Fragment>
            <strong style={{ color: '#000' }}>{selectedRowsCount}</strong>
            &nbsp;of&nbsp;
            {totalRowsCount} {entityName}
          </Fragment>
        ) : (
          <Fragment>
            {totalRowsCount} {entityName}
          </Fragment>
        )}
      </Title>
    )
  }

  return (
    <Title style={style}>
      {Component && (
        <Component
          totalRowsCount={totalRowsCount}
          selectedRowsCount={selectedRowsCount}
        />
      )}
    </Title>
  )
}

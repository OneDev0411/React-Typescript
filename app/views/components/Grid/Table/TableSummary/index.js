import React, { Fragment } from 'react'
import styled from 'styled-components'

const Container = styled.div``

const Title = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
  line-height: 40px;
`

export const TableSummary = ({
  Component,
  entityName,
  selectedRowsCount,
  totalRowsCount
}) => {
  if (!Component && entityName) {
    return (
      <Container>
        <Title>
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
      </Container>
    )
  }

  return (
    <Container>
      <Title>
        {Component && (
          <Component
            totalRowsCount={totalRowsCount}
            selectedRowsCount={selectedRowsCount}
          />
        )}
      </Title>
    </Container>
  )
}

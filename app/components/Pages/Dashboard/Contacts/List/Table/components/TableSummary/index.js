import React, { Fragment } from 'react'

export function TableSummary(props) {
  return (
    <Fragment>
      {props.selectedRowsCount > 0 ? (
        <div>
          <strong style={{ color: '#000' }}>{props.selectedRowsCount}</strong>
          &nbsp;of&nbsp;
          {props.totalRowsCount} contacts
        </div>
      ) : (
        <div>{props.totalRowsCount} contacts</div>
      )}
    </Fragment>
  )
}

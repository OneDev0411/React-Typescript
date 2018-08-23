import React from 'react'

export default ({ description }) => (
  <div className="table-container">
    <div className="list-empty">
      <i className="fa fa-search" aria-hidden="true" />
      <div className="title">No Results</div>
      <div className="descr">{description}</div>
    </div>
  </div>
)

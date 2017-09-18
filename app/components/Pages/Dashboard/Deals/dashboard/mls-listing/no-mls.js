import React from 'react'

export default ({
  addMls
}) => (
  <div className="empty-state">
    <i className="fa fa-info-circle fa-2x" />
    <div className="title">
      Complete Deal
    </div>

    <span
      className="add-mls"
      onClick={addMls}
    >
      Add a MLS #
    </span>
  </div>
)

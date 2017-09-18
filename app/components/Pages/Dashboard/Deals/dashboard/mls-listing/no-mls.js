import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <div className="empty-state">
        <i className="fa fa-info-circle fa-2x" />
        <div className="title">
          Complete Deal
        </div>

        <span className="add-mls">
          Add a MLS #
        </span>
      </div>
    )
  }
}

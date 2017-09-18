import React from 'react'
import EmptyState from './no-mls'

export default class extends React.Component {
  render() {
    const { deal } = this.props

    return (
      <div className="deal-mls">
        {
          !deal.listing &&
          <EmptyState />
        }
      </div>
    )
  }
}

import React from 'react'
import ListingStatus from './listing-status'

class Info extends React.Component {
  render() {
    const { deal, editMls, deleteMls } = this.props
    const hasListing = deal && deal.mls_context

    return (
      <div className="mls-info">
        {!deal.is_draft && <ListingStatus deal={deal} />}

        <div className="item">
          <div className="lbl">MLS#:</div>
          <div className="value mls-number">
            {(hasListing && deal.mls_context.mls_number) || '-'}

            <button
              className="c-button--shadow deals-info__edit-cta hidden"
              onClick={editMls}
            >
              EDIT
            </button>

            {hasListing && (
              <button onClick={deleteMls} className="c-button--shadow">
                <i className="fa fa-times-circle" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Info

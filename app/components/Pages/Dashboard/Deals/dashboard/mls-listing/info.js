import React, { Component } from 'react'
import ListingStatus from './listing-status'

class Info extends Component {
  render() {
    const { deal, editMls, deleteMls } = this.props
    const hasMLSAddress = deal && deal.mls_context

    return (
      <div className="mls-info">
        {!deal.is_draft && <ListingStatus deal={deal} />}

        <div className="item">
          <div className="lbl">MLS#</div>
          <div className="value mls-number">
            {(hasMLSAddress && deal.mls_context.mls_number) || '-'}

            <button
              className="c-button--shadow deals-info__mls__edit-cta hidden"
              onClick={editMls}
            >
              EDIT
            </button>

            {hasMLSAddress && (
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

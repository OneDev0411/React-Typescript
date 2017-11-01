import React from 'react'
import ListingStatus from './listing-status'

export default ({
  deal,
  editMls,
  deleteMls
}) => (
  <div className="mls-info">
    <ListingStatus
      deal={deal}
    />

    <div className="item">
      <div className="lbl">MLS#:</div>
      <div className="value mls-number">
        { deal.mls_context.mls_number }
        <i
          className="fa fa-pencil"
          onClick={editMls}
        />

        <i
          className="fa fa-times-circle"
          onClick={deleteMls}
        />
      </div>
    </div>
  </div>
)

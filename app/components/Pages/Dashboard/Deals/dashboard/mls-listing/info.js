import React from 'react'
import Deal from '../../../../../../models/Deal'
import { getStatusColorClass } from '../../../../../../utils/listing'

export default ({
  deal,
  editMls,
  deleteMls
}) => {
  const status = Deal.get.field(deal, 'listing_status')

  return (
    <div className="mls-info">
      <div className="item">
        <div className="lbl">Status:</div>
        <div className="value">
          <span
            className="status"
            style={{ background: getStatusColorClass(status) }}
          />
          { status }
        </div>
      </div>

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
}

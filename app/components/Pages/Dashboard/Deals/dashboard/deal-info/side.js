import React from 'react'
import Deal from '../../../../../../models/Deal'

function getSideName(deal) {
  const enderType = Deal.get.field(deal, 'ender_type')
  const dealType = deal.deal_type === 'Buying' ? 'Buying' : 'Listing'

  if (enderType === 'AgentDoubleEnder') {
    return 'Both'
  } else if (enderType === 'OfficeDoubleEnder') {
    return `${dealType} (Office DE)`
  }

  return dealType
}

export default ({ deal }) => (
  <div className="deal-fact deal-side">
    <div className="field">Side</div>
    <div className="value">{getSideName(deal)}</div>
  </div>
)

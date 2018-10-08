import React, { Fragment } from 'react'

import AgentNetwork from './AgentNetwork'
import OpenHouse from './OpenHouse'

export default function MarketingPane({ deal }) {
  return (
    <div>
      <AgentNetwork deal={deal} />
      <OpenHouse deal={deal} />
    </div>
  )
}

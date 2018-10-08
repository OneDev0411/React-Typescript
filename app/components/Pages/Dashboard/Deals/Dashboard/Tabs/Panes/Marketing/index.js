import React from 'react'

import AgentNetwork from './AgentNetwork'
import OpenHouse from './OpenHouse'
import Promote from './Promote'

import { MarketingContainer } from './styled'

export default function MarketingPane(props) {
  return (
    <MarketingContainer>
      <AgentNetwork deal={props.deal} />
      <OpenHouse deal={props.deal} user={props.user} />
      <Promote deal={props.deal} user={props.user} />
    </MarketingContainer>
  )
}

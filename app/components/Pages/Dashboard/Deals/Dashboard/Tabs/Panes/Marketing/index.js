import React from 'react'

import AgentNetwork from './AgentNetwork'
import OpenHouse from './OpenHouse'
import EmailMarketing from './EmailMarketing'
import SocialMarketing from './SocialMarketing'

import { MarketingContainer } from './styled'

export default function MarketingPane(props) {
  return (
    <MarketingContainer>
      {props.deal.listing && <AgentNetwork deal={props.deal} />}
      {props.deal.listing && <OpenHouse deal={props.deal} user={props.user} />}
      <EmailMarketing deal={props.deal} user={props.user} />
      <SocialMarketing deal={props.deal} user={props.user} />
    </MarketingContainer>
  )
}

import React from 'react'

import { isSelling } from 'models/Deal/helpers/context'
import { hasUserAccessToAgentNetwork } from 'utils/user-teams'

import AgentNetwork from './AgentNetwork'
import MyMarketingMatters from './MyMarketingMatters'
import OpenHouse from './OpenHouse'
import EmailMarketing from './EmailMarketing'
import SocialMarketing from './SocialMarketing'

import { MarketingContainer } from './styled'

interface Props {
  deal: IDeal
  user: IUser
}

export default function MarketingPane({ deal, user }: Props) {
  return (
    <MarketingContainer>
      {hasUserAccessToAgentNetwork(user) && deal.listing && (
        <AgentNetwork deal={deal} />
      )}
      <MyMarketingMatters user={user} deal={deal} />
      {isSelling(deal) && deal.listing && <OpenHouse deal={deal} user={user} />}
      <EmailMarketing deal={deal} user={user} />
      <SocialMarketing deal={deal} user={user} />
    </MarketingContainer>
  )
}

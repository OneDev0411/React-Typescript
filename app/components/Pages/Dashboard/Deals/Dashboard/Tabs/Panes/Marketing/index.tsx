import React from 'react'

import { isSelling } from 'models/Deal/helpers/context'

import Acl from 'components/Acl'

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
      {deal.listing && <AgentNetwork deal={deal} />}
      <Acl.AgentNetwork>
        <MyMarketingMatters user={user} deal={deal} />
      </Acl.AgentNetwork>
      {isSelling(deal) && deal.listing && <OpenHouse deal={deal} user={user} />}
      <EmailMarketing deal={deal} user={user} />
      <SocialMarketing deal={deal} user={user} />
    </MarketingContainer>
  )
}

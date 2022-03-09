import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'
import { isSelling } from 'models/Deal/helpers/context'

import AgentNetwork from './AgentNetwork'
import EmailMarketing from './EmailMarketing'
import MyMarketingMatters from './MyMarketingMatters'
import OpenHouse from './OpenHouse'
import SocialMarketing from './SocialMarketing'
import { MarketingContainer } from './styled'

interface Props {
  deal: IDeal
  user: IUser
}

export default function MarketingPane({ deal, user }: Props) {
  const hasAccessToAgentNetwork = useAcl(ACL.AGENT_NETWORK)

  return (
    <MarketingContainer>
      {hasAccessToAgentNetwork && deal.listing && <AgentNetwork deal={deal} />}
      <MyMarketingMatters user={user} deal={deal} />
      {isSelling(deal) && deal.listing && <OpenHouse deal={deal} user={user} />}
      <EmailMarketing deal={deal} user={user} />
      <SocialMarketing deal={deal} user={user} />
    </MarketingContainer>
  )
}

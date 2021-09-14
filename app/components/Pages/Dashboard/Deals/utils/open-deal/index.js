import { browserHistory } from 'react-router'

import onDealOpened from '../on-deal-opened'

export default function OpenDeal(dealId) {
  onDealOpened()
  browserHistory.push(`/dashboard/deals/${dealId}`)
}

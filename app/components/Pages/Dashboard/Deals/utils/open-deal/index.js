import { browserHistory } from 'react-router'

import onDealOpened from '../on-deal-opened'

export default function(dealId) {
  onDealOpened()
  browserHistory.push(`/dashboard/deals/${dealId}`)
}

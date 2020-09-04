import { useSelector } from 'react-redux'

import { IAppState } from '../reducers'
import { isBackOffice } from '../utils/user-teams'

export function useDealsNotificationsNumber(): number {
  const user = useSelector((state: IAppState) => state.user)
  const deals: IDeal[] = useSelector((state: IAppState) =>
    Object.values(state.deals.list || {})
  )

  if (isBackOffice(user)) {
    return deals.filter(deal => !deal.is_draft && ~~deal.attention_requests > 0)
      .length
  }

  return deals.filter(
    deal => deal.new_notifications && deal.new_notifications.length > 0
  ).length
}

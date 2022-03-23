import { useSelector } from 'react-redux'

import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import { IAppState } from '../reducers'

export function useDealsNotificationsNumber(): number {
  const isBackOffice = useAcl(ACL.BACK_OFFICE)

  const deals: IDeal[] = useSelector((state: IAppState) =>
    Object.values(state.deals.list || {})
  )

  if (isBackOffice) {
    return deals.filter(deal => !deal.is_draft && ~~deal.attention_requests > 0)
      .length
  }

  return deals.filter(
    deal => deal.new_notifications && deal.new_notifications.length > 0
  ).length
}

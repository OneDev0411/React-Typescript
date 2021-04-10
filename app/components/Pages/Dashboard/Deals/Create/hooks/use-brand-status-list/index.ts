import { useState } from 'react'
import { useAsync } from 'react-use'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'
import { getActiveTeamId } from 'utils/user-teams'

export function useStatusList(deal: IDeal | null): IDealStatus[] {
  const [statuses, setStatuses] = useState<IDealStatus[]>([])
  const user = useSelector<IAppState, IUser>(state => selectUser(state))
  const dealId = deal?.id

  useAsync(async () => {
    if (!dealId) {
      return
    }

    const list = [] // await getBrandStatuses(getActiveTeamId(user)!)

    setStatuses(list)
  }, [dealId])

  return deal
    ? statuses.filter(status => {
        if (deal.deal_type === 'Selling' && !status.is_active) {
          return false
        }

        if (deal.deal_type === 'Buying' && !status.is_pending) {
          return false
        }

        return (
          status.deal_types.includes(deal.deal_type) &&
          status.property_types.includes(deal.property_type)
        )
      })
    : []
}

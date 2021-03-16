import { useState } from 'react'
import { useAsync } from 'react-use'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'
import { getBrandStatuses } from 'models/Deal/status/get-brand-statuses'
import { getActiveTeamId } from 'utils/user-teams'

export function useStatusList(deal: IDeal | null): IDealStatus[] {
  const [statuses, setStatuses] = useState<IDealStatus[]>([])
  const user = useSelector<IAppState, IUser>(state => selectUser(state))
  const dealId = deal?.id

  useAsync(async () => {
    console.log('>>>$$$>', dealId)

    if (!dealId) {
      return
    }

    const list = await getBrandStatuses(getActiveTeamId(user)!)

    console.log('>>>>', list)

    setStatuses(list)
  }, [dealId])

  return deal
    ? statuses.filter(
        status =>
          status.is_pending &&
          status.deal_types.includes('Buying') &&
          status.property_types.includes(deal.property_type)
      )
    : []
}

import { useState } from 'react'

import { useAsync } from 'react-use'

import { getDealStatuses } from 'models/Deal/status/get-deal-statuses'

export function useStatusList(deal: IDeal | null): IDealStatus[] {
  const [statuses, setStatuses] = useState<IDealStatus[]>([])

  const dealId = deal?.id

  useAsync(async () => {
    if (!dealId) {
      return
    }

    const list = await getDealStatuses(dealId)

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

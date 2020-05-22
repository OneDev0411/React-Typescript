import { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { getDealStatuses } from 'models/Deal/status/get-deal-statuses'

export function useDealStatuses(dealId: UUID) {
  const [statuses, setStatuses] = useState<IDealStatus[]>([])

  useEffectOnce(() => {
    const fetchStatuses = async () => {
      try {
        const statuses = await getDealStatuses(dealId)

        setStatuses(statuses)
      } catch (e) {
        console.log(e)
      }
    }

    fetchStatuses()
  })

  return statuses
}

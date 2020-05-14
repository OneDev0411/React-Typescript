import { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { getDealStatuses } from 'models/Deal/status/get-statuses'

export function useDealStatuses(brandId: UUID) {
  const [statuses, setStatuses] = useState<IDealStatus[]>([])

  useEffectOnce(() => {
    const fetchStatuses = async () => {
      try {
        const statuses = await getDealStatuses(brandId)

        setStatuses(statuses)
      } catch (e) {
        console.log(e)
      }
    }

    fetchStatuses()
  })

  return statuses
}

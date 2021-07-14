import { useState } from 'react'
import { useEffectOnce } from 'react-use'

import {
  getBrandStatuses,
  updateBrandStatus
} from '@app/models/brand/brand-statuses'

export function useBrandStatuses(
  brandId: UUID
): [IDealStatus[], (id: UUID, data: Record<string, unknown>) => void] {
  const [statuses, setStatuses] = useState<IDealStatus[]>([])

  useEffectOnce(() => {
    const fetchStatuses = async () => {
      try {
        const statuses = await getBrandStatuses(brandId)

        setStatuses(statuses)
      } catch (e) {
        console.log(e)
      }
    }

    fetchStatuses()
  })

  const updateStatus = async (
    statusId: UUID,
    data: Record<string, unknown>
  ) => {
    try {
      await updateBrandStatus(brandId, statusId, data)

      setStatuses(statuses =>
        statuses.map(status =>
          status.id === statusId ? { ...status, ...data } : status
        )
      )
    } catch (e) {
      console.log(e)
    }
  }

  return [statuses, updateStatus]
}

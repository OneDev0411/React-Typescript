import { useState } from 'react'

import { useEffectOnce } from 'react-use'

import {
  createBrandStatus,
  getBrandStatuses,
  updateBrandStatus,
  deleteBrandStatus
} from '@app/models/brand/brand-statuses'

export function useBrandStatuses(
  brandId: UUID
): [
  IDealStatus[],
  (id: UUID, data: Record<string, unknown>) => Promise<IDealStatus | void>,
  (id: UUID) => Promise<void>
] {
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

  const upsertStatus = async (
    statusId: UUID,
    data: Record<string, unknown>
  ) => {
    try {
      if (!statusId) {
        const newStatus = await createBrandStatus(brandId, data)

        setStatuses(statuses => [newStatus, ...statuses])

        return newStatus
      }

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

  const deleteStatus = async (statusId: UUID) => {
    try {
      await deleteBrandStatus(brandId, statusId)
      setStatuses(statuses => statuses.filter(status => status.id !== statusId))
    } catch (e) {
      console.log(e)
    }
  }

  return [statuses, upsertStatus, deleteStatus]
}

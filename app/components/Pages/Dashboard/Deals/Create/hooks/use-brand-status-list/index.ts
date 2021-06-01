import { useState } from 'react'
import { useAsync } from 'react-use'

export function useStatusList(deal: IDeal | null): IDealStatus[] {
  const [statuses, setStatuses] = useState<IDealStatus[]>([])
  const dealId = deal?.id

  useAsync(async () => {
    if (!dealId) {
      return
    }

    const list = []

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

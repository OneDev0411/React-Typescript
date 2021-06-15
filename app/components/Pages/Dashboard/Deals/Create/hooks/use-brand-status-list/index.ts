import { useDealStatuses } from 'hooks/use-deal-statuses'

export function useStatusList(deal: IDeal | null): IDealStatus[] {
  const statuses = useDealStatuses(deal)

  return deal
    ? statuses.filter(status => {
        if (deal.deal_type === 'Selling' && !status.is_active) {
          return false
        }

        if (deal.deal_type === 'Buying' && !status.is_pending) {
          return false
        }

        return true
      })
    : []
}

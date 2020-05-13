import { getStatus } from 'models/Deal/helpers/context'

export function isActiveDeal(deal: IDeal, statuses: IDealStatus[]): boolean {
  if (deal.is_draft || deal.deleted_at) {
    return false
  }

  return searchStatusByFlag(deal, statuses, 'is_active')
}

export function isPendingDeal(deal: IDeal, statuses: IDealStatus[]): boolean {
  if (deal.is_draft || deal.deleted_at) {
    return false
  }

  return searchStatusByFlag(deal, statuses, 'is_pending')
}

export function isArchivedDeal(deal: IDeal, statuses: IDealStatus[]): boolean {
  if (deal.deleted_at) {
    return true
  }

  return searchStatusByFlag(deal, statuses, 'is_archived')
}

function searchStatusByFlag(
  deal: IDeal,
  statuses: IDealStatus[],
  flag: 'is_active' | 'is_pending' | 'is_archived'
): boolean {
  const status = statuses.find(item => item.label === getStatus(deal))

  return !!(status && status[flag] === true)
}

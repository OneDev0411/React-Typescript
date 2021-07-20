import { getField } from '../get-field'

export function getStatus(deal: IDeal): IListingStatus {
  if (deal.deleted_at) {
    return 'Archived'
  }

  const key =
    deal?.deal_type === 'Buying' || deal?.has_active_offer
      ? 'contract_status'
      : 'listing_status'

  const status = getField(deal, key)

  return status ? status.trim() : status
}
